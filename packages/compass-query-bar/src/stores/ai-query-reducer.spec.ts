import { expect } from 'chai';
import { promises as fs } from 'fs';
import os from 'os';
import Sinon from 'sinon';
import configureStore from './query-bar-store';
import type { QueryBarStoreOptions } from './query-bar-store';
import {
  AIQueryActionTypes,
  cancelAIQuery,
  runAIQuery,
} from './ai-query-reducer';

describe('aiQueryReducer', function () {
  const sandbox = Sinon.createSandbox();

  afterEach(function () {
    sandbox.resetHistory();
  });

  let tmpDir: string;

  before(async function () {
    tmpDir = await fs.mkdtemp(os.tmpdir());
  });

  function createStore(opts: Partial<QueryBarStoreOptions> = {}) {
    return configureStore({
      basepath: tmpDir,
      ...opts,
    });
  }

  describe('runAIQuery', function () {
    describe('with a successful server response', function () {
      it('should succeed', async function () {
        const mockAtlasService = {
          getQueryFromUserPrompt: sandbox
            .stub()
            .resolves({ content: { query: { _id: 1 } } }),
        };

        const mockDataService = {
          sample: sandbox.stub().resolves([{ _id: 42 }]),
          getConnectionString: sandbox.stub().returns({ hosts: [] }),
        };

        const store = createStore({
          namespace: 'database.collection',
          dataProvider: {
            dataProvider: mockDataService as any,
          },
          atlasService: mockAtlasService as any,
        });

        expect(store.getState().aiQuery.status).to.equal('ready');

        await store.dispatch(runAIQuery('testing prompt'));

        expect(mockAtlasService.getQueryFromUserPrompt).to.have.been.calledOnce;
        expect(
          mockAtlasService.getQueryFromUserPrompt.getCall(0)
        ).to.have.nested.property('args[0].userPrompt', 'testing prompt');
        expect(
          mockAtlasService.getQueryFromUserPrompt.getCall(0)
        ).to.have.nested.property('args[0].collectionName', 'collection');
        expect(mockAtlasService.getQueryFromUserPrompt.getCall(0))
          .to.have.nested.property('args[0].sampleDocuments')
          .deep.eq([{ _id: 42 }]);

        expect(store.getState().aiQuery.aiQueryFetchId).to.equal(-1);
        expect(store.getState().aiQuery.errorMessage).to.equal(undefined);
        expect(store.getState().aiQuery.status).to.equal('success');
      });
    });

    describe('when there is an error', function () {
      it('sets the error on the store', async function () {
        const mockAtlasService = {
          getQueryFromUserPrompt: sandbox
            .stub()
            .rejects(new Error('500 Internal Server Error')),
        };

        const store = createStore({ atlasService: mockAtlasService as any });
        expect(store.getState().aiQuery.errorMessage).to.equal(undefined);
        await store.dispatch(runAIQuery('testing prompt') as any);
        expect(store.getState().aiQuery.aiQueryFetchId).to.equal(-1);
        expect(store.getState().aiQuery.errorMessage).to.equal(
          '500 Internal Server Error'
        );
        expect(store.getState().aiQuery.status).to.equal('ready');
      });
    });
  });

  describe('cancelAIQuery', function () {
    it('should unset the fetching id on the store', function () {
      const store = createStore();
      expect(store.getState().aiQuery.aiQueryFetchId).to.equal(-1);

      store.dispatch({
        type: AIQueryActionTypes.AIQueryStarted,
        fetchId: 1,
      });

      expect(store.getState().aiQuery.aiQueryFetchId).to.equal(1);
      store.dispatch(cancelAIQuery());
      expect(store.getState().aiQuery.aiQueryFetchId).to.equal(-1);
    });
  });
});
