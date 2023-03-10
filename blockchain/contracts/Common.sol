// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

// Type definitions
type Hash is bytes32;
type Timestamp is uint256;

enum ConformityState {
    Functioning,
    WaitingReview,
    CorrectiveMeasureNeeded
}
