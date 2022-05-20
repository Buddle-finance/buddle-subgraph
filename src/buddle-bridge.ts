import { BigInt } from "@graphprotocol/graph-ts"
import {
  FundsBridged,
  OwnershipTransferred
} from "../generated/BuddleBridge/BuddleBridge"
import { ContractOwner, TicketTransfer } from "../generated/schema"

export function handleFundsBridged(event: FundsBridged): void {
    let evParams = event.params
    // TODO: change ticketId to ticket
    let ticketTransfer = new TicketTransfer(evParams.ticketId.toHexString())
    ticketTransfer.ticket = evParams.ticketId.toHexString()
    ticketTransfer.timestamp = evParams.timestamp
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
    let evParams = event.params
  
    let contractOwner = new ContractOwner(event.transaction.hash.toHexString())
    contractOwner.contract = event.address
    contractOwner.owner = evParams.newOwner
    contractOwner.block = event.block.number
    contractOwner.time = event.block.timestamp
}
