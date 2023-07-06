// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.19;

library ConformityState {
    enum State {
        FUNCTIONING,
        CORRECTIVE_MEASURE_NEEDED,
        WAITING_REVIEW
    }

    State public constant CONFORMITY_STATE_FUNCTIONING = State.FUNCTIONING;
    State public constant CONFORMITY_STATE_CORRECTIVE_MEASURE_NEEDED =
        State.CORRECTIVE_MEASURE_NEEDED;
    State public constant CONFORMITY_STATE_WAITING_REVIEW =
        State.WAITING_REVIEW;

    // Errors
    error InvalidConformityState();

    function assertValidConformityState(State state_) internal pure {
        if (
            state_ != CONFORMITY_STATE_FUNCTIONING ||
            state_ != CONFORMITY_STATE_CORRECTIVE_MEASURE_NEEDED ||
            state_ != CONFORMITY_STATE_WAITING_REVIEW
        ) revert InvalidConformityState();
    }
}
