import {
  OwnershipTransferred,
  TicketConfirmed,
  TicketCreated,
  TransferStarted
} from "../generated/BuddleSource/BuddleSrc"

import { 
  Transfer,
  TransferData, 
  Ticket, 
  TicketToken,
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

export function handleTicketConfirmed(event: TicketConfirmed): void {
  let evParams = event.params
  // Update existing ticket - guaranteed to exist
  let ticket = new Ticket(evParams.ticket.toHexString())

  ticket.confirmed = true
  ticket.save()
}

export function handleTicketCreated(event: TicketCreated): void {

  let evParams = event.params
  let ticket = new Ticket(evParams.ticket.toHexString())

  ticket.confirmed = false
  ticket.ticket = evParams.ticket
  ticket.destChain = evParams.destChain
  ticket.firstId = evParams.firstIdForTicket
  ticket.lastId =  evParams.lastIdForTicket
  ticket.stateRoot = evParams.stateRoot
  
  for (let index = 0; index < evParams.tokens.length; index++) {
    let token = new TicketToken(evParams.ticket.toHexString() + "-" + index.toString())
    token.token = evParams.tokens[index]
    token.amount = evParams.amounts[index]
    token.bounty = evParams.bounty[index]
    token.save()
    ticket.ticketTokens.push(evParams.ticket.toHexString())
  }

  ticket.save()
}

export function handleTransferStarted(event: TransferStarted): void {
  let evParams = event.params
  let transfer = new Transfer(evParams.transferID.toString())

  transfer.transferId = evParams.transferID
  transfer.node = evParams.node
  transfer.srcChain = evParams.srcChain
  transfer.liquidityWithdrawn = false
  transfer.completed = false

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
