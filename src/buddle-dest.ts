import {
  LiquidityOwnerChanged,
  OwnershipTransferred,
  RootApproved,
  TransferCompleted,
  WithdrawalEvent
} from "../generated/BuddleDestination/BuddleDest"
import { 
  Transfer,
  TransferData, 
  ApprovedRoot,
  ContractOwner
} from "../generated/schema"

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  let evParams = event.params

  let contractOwner = new ContractOwner(event.transaction.hash.toHexString())
  contractOwner.contract = event.address
  contractOwner.owner = evParams.newOwner
  contractOwner.block = event.block.number
  contractOwner.time = event.block.timestamp
}

export function handleLiquidityOwnerChanged(event: LiquidityOwnerChanged): void {
  let evParams = event.params
  // Update existing transfer - guaranteed to exist
  let transfer = new Transfer(evParams.transferID.toString())
  transfer.liquidityProvider = evParams.newOwner
  transfer.save()
}


export function handleRootApproved(event: RootApproved): void {
  let evParams = event.params
  let approvedRoot = new ApprovedRoot(event.transaction.hash.toHexString())
  approvedRoot.srcChain = evParams.sourceChain
  approvedRoot.time = event.block.timestamp
  approvedRoot.stateRoot = evParams.stateRoot
  approvedRoot.srcChain = evParams.sourceChain

  approvedRoot.save()
}

export function handleTransferCompleted(event: TransferCompleted): void {
  let evParams = event.params
  let transfer = new Transfer(evParams.transferID.toString())

  transfer.transferId = evParams.transferID
  transfer.liquidityWithdrawn = false
  transfer.completed = true
  transfer.liquidityProvider = evParams.liquidityProvider

  let transferData = new TransferData(evParams.transferID.toString())
  let transferDataEvent = evParams.transferData
  
  transferData.tokenAddress = transferDataEvent.tokenAddress
  transferData.destination = transferDataEvent.destination
  transferData.amount = transferDataEvent.amount
  transferData.fee = transferDataEvent.fee
  transferData.startTime = transferDataEvent.startTime
  transferData.feeRampup = transferDataEvent.feeRampup
  transferData.chain = transferDataEvent.chain
  transferData.save()

  transfer.transferData = evParams.transferID.toString()
  transfer.save()
}

export function handleWithdrawalEvent(event: WithdrawalEvent): void {
  let evParams = event.params
  let transfer = Transfer.load(evParams.transferID.toString())

  if (!transfer) {
    transfer = new Transfer(evParams.transferID.toString())

    transfer.transferId = evParams.transferID
    transfer.liquidityWithdrawn = false
    transfer.completed = true

    let transferData = new TransferData(evParams.transferID.toString())
    let transferDataEvent = evParams.transferData
    
    transferData.tokenAddress = transferDataEvent.tokenAddress
    transferData.destination = transferDataEvent.destination
    transferData.amount = transferDataEvent.amount
    transferData.fee = transferDataEvent.fee
    transferData.startTime = transferDataEvent.startTime
    transferData.feeRampup = transferDataEvent.feeRampup
    transferData.chain = transferDataEvent.chain
    transferData.save()
    transfer.transferData = evParams.transferID.toString()
  } else {
    transfer.liquidityWithdrawn = true
  }

  transfer.save()
}
