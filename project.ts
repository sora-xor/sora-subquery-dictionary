import {
  SubstrateDatasourceKind,
  SubstrateHandlerKind,
  SubstrateProject,
} from "@subql/types";

// Can expand the Datasource processor types via the genreic param
const project: SubstrateProject = {
  specVersion: "1.0.0",
  version: "0.0.1",
  name: "polkadot-starter",
  description:
    "This project can be used as a starting point for developing your SubQuery project",
  runner: {
    node: {
      name: "@subql/node",
      version: ">=3.0.1",
    },
    query: {
      name: "@subql/query",
      version: "*",
    },
  },
  schema: {
    file: "./schema.graphql",
  },
  network: {
    /* The genesis hash of the network (hash of block 0) */
    chainId:
      "0x7e4e32d0feafd4f9c9414b0be86373f9a1efa904809b683453a9af6856d38ad5",
    /**
     * This endpoint must be a public non-pruned archive node
     * Public nodes may be rate limited, which can affect indexing speed
     * When developing your project we suggest getting a private API key
     * You can get them from OnFinality for free https://app.onfinality.io
     * https://documentation.onfinality.io/support/the-enhanced-api-service
     */
    endpoint: ["wss://mof3.sora.org"],
    bypassBlocks: [
      9633, 14855, 15156, 15663, 25432, 25467, 26157, 27521, 27601, 240175,
      242625, 246858, 247995, 258152, 263341, 268943, 282439, 319553, 322075,
    ],
    chaintypes: { file: "./types.json" },
  },
  dataSources: [
    {
      kind: SubstrateDatasourceKind.Runtime,
      startBlock: 9000000,
      mapping: {
        file: "./dist/index.js",
        handlers: [
          /*{
            kind: SubstrateHandlerKind.Block,
            handler: "handleBlock",
            filter: {
              modulo: 100,
            },
          },*/
          /*{
            kind: SubstrateHandlerKind.Call,
            handler: "handleCall",
            filter: {
              module: "balances",
            },
          },*/
          {
            kind: SubstrateHandlerKind.Block,
            handler: "handleBlock",
          },
        ],
      },
    },
  ],
};

// Must set default to the project instance
export default project;
