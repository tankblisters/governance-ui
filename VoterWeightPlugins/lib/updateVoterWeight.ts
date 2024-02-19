import {
  PublicKey,
  TransactionInstruction,
  Connection,
} from '@solana/web3.js'
import { getPlugins } from './getPlugins'
import {VoterWeightAction} from "@solana/spl-governance";

interface UpdateVoterWeightRecordArgs {
  walletPublicKey: PublicKey
  realmPublicKey: PublicKey
  governanceMintPublicKey: PublicKey
  connection: Connection
  action?: VoterWeightAction
}

export const updateVoterWeight = async ({
  walletPublicKey,
  realmPublicKey,
  governanceMintPublicKey,
  connection,
  action
}: UpdateVoterWeightRecordArgs): Promise<{ pre: TransactionInstruction[], post: TransactionInstruction[]}> => {
  const plugins = await getPlugins({
    realmPublicKey,
    governanceMintPublicKey,
    walletPublicKey,
    connection,
  })
  const preIxes: TransactionInstruction[] = []
  const postIxes: TransactionInstruction[] = []

  for (const plugin of plugins) {
    const updateVoterWeightRecordIx = await plugin.client.updateVoterWeightRecord(
      walletPublicKey,
      realmPublicKey,
      governanceMintPublicKey,
      action
    )
    preIxes.push(...updateVoterWeightRecordIx.pre)
    postIxes.push(...updateVoterWeightRecordIx.post || [])
  }
  return { pre: preIxes, post: postIxes }
}