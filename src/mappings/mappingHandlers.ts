import { EventRecord } from "@polkadot/types/interfaces";
import { SubstrateExtrinsic, SubstrateBlock } from "@subql/types";
import { SpecVersion, Event, Extrinsic } from "../types";

let specVersion: SpecVersion | undefined;
export async function handleBlock(block: SubstrateBlock): Promise<void> {
  // Initialise Spec Version
  if (!specVersion) {
    specVersion = await SpecVersion.get(block.specVersion.toString());
  }

  // Check for updates to Spec Version
  if (!specVersion || specVersion.id !== block.specVersion.toString()) {
    specVersion = SpecVersion.create({
      id: block.specVersion.toString(),
      blockHeight: block.block.header.number.toBigInt(),
    });
    await specVersion.save();
  }

  // Process all events in block
  async function processEvents(block: SubstrateBlock) {
    block.events
      .filter(
        (evt) =>
          !(
            evt.event.section === "system" &&
            evt.event.method === "ExtrinsicSuccess"
          )
      )
      .map((evt, idx) => {
        handleEvent(
          block.block.header.number.toString(),
          block.timestamp,
          idx,
          evt
        ).save();
        // logger.warn(`Event ${block.block.header.number}-${idx} saved`);
      });
  }

  async function processExtrinsics(block: SubstrateBlock) {
    await Promise.all(
      wrapExtrinsics(block).map(async (ext, idx) => {
        const result = await handleCall(
          `${block.block.header.number.toString()}-${idx}`,
          ext
        );
        if (result.module == "timestamp") {
          return;
        }
        // logger.warn(`Extrinsic ${ext.extrinsic.hash} saved`);
        result.save();
      })
    );
  }

  // Save all data
  await Promise.all([
    await processExtrinsics(block),
    await processEvents(block),
  ]);
}

function handleEvent(
  blockNumber: string,
  blockTimestamp: Date,
  eventIdx: number,
  event: EventRecord
): Event {
  const newEvent = Event.create({
    id: `${blockNumber}-${eventIdx}`,
    blockHeight: BigInt(blockNumber),
    module: event.event.section,
    method: event.event.method,
    params: event.event.data.toHuman() as Object,
    timestamp: blockTimestamp,
  });
  return newEvent;
}
function handleCall(idx: string, extrinsic: SubstrateExtrinsic): Extrinsic {
  const newExtrinsic = Extrinsic.create({
    id: idx,
    txHash: extrinsic.extrinsic.hash.toString(),
    module: extrinsic.extrinsic.method.section,
    method: extrinsic.extrinsic.method.method,
    blockHeight: extrinsic.block.block.header.number.toBigInt(),
    success: extrinsic.success,
    isSigned: extrinsic.extrinsic.isSigned,
    timestamp: extrinsic.block.timestamp,
    details: JSON.parse(JSON.stringify(extrinsic.extrinsic.toHuman())).method
      .args,
    signer: extrinsic.extrinsic.signer.toString(),
  });
  return newExtrinsic;
}

function wrapExtrinsics(wrappedBlock: SubstrateBlock): SubstrateExtrinsic[] {
  return wrappedBlock.block.extrinsics.map((extrinsic, idx) => {
    const events = wrappedBlock.events.filter(
      ({ phase }) => phase.isApplyExtrinsic && phase.asApplyExtrinsic.eqn(idx)
    );
    return {
      idx,
      extrinsic,
      block: wrappedBlock,
      events,
      success:
        events.findIndex((evt) => evt.event.method === "ExtrinsicSuccess") > -1,
    };
  });
}
