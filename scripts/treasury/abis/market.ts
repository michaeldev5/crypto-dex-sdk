export const market = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_PT',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_scalarRoot',
        type: 'int256',
        internalType: 'int256',
      },
      {
        name: '_initialAnchor',
        type: 'int256',
        internalType: 'int256',
      },
      {
        name: '_lnFeeRateRoot',
        type: 'uint80',
        internalType: 'uint80',
      },
      {
        name: '_veZLK',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_gaugeController',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: '_storage',
    inputs: [],
    outputs: [
      {
        name: 'totalPt',
        type: 'int128',
        internalType: 'int128',
      },
      {
        name: 'totalSy',
        type: 'int128',
        internalType: 'int128',
      },
      {
        name: 'lastLnImpliedRate',
        type: 'uint96',
        internalType: 'uint96',
      },
      {
        name: 'observationIndex',
        type: 'uint16',
        internalType: 'uint16',
      },
      {
        name: 'observationCardinality',
        type: 'uint16',
        internalType: 'uint16',
      },
      {
        name: 'observationCardinalityNext',
        type: 'uint16',
        internalType: 'uint16',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'activeBalance',
    inputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'allowance',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'spender',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'approve',
    inputs: [
      {
        name: 'spender',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'burn',
    inputs: [
      {
        name: 'receiverSy',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'receiverPt',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'netLpToBurn',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'netSyOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netPtOut',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'decimals',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint8',
        internalType: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'expiry',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'factory',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getNonOverrideLnFeeRateRoot',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint80',
        internalType: 'uint80',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getRewardTokens',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address[]',
        internalType: 'address[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'increaseObservationsCardinalityNext',
    inputs: [
      {
        name: 'cardinalityNext',
        type: 'uint16',
        internalType: 'uint16',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'isExpired',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'lastRewardBlock',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'mint',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'netSyDesired',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netPtDesired',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'netLpOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netSyUsed',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netPtUsed',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'name',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string',
        internalType: 'string',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'observations',
    inputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'blockTimestamp',
        type: 'uint32',
        internalType: 'uint32',
      },
      {
        name: 'lnImpliedRateCumulative',
        type: 'uint216',
        internalType: 'uint216',
      },
      {
        name: 'initialized',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'observe',
    inputs: [
      {
        name: 'secondsAgos',
        type: 'uint32[]',
        internalType: 'uint32[]',
      },
    ],
    outputs: [
      {
        name: 'lnImpliedRateCumulative',
        type: 'uint216[]',
        internalType: 'uint216[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'readState',
    inputs: [
      {
        name: 'router',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: 'market',
        type: 'tuple',
        internalType: 'struct MarketState',
        components: [
          {
            name: 'totalPt',
            type: 'int256',
            internalType: 'int256',
          },
          {
            name: 'totalSy',
            type: 'int256',
            internalType: 'int256',
          },
          {
            name: 'totalLp',
            type: 'int256',
            internalType: 'int256',
          },
          {
            name: 'treasury',
            type: 'address',
            internalType: 'address',
          },
          {
            name: 'scalarRoot',
            type: 'int256',
            internalType: 'int256',
          },
          {
            name: 'expiry',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'lnFeeRateRoot',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'reserveFeePercent',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'lastLnImpliedRate',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'readTokens',
    inputs: [],
    outputs: [
      {
        name: '_SY',
        type: 'address',
        internalType: 'contract IStandardizedYield',
      },
      {
        name: '_PT',
        type: 'address',
        internalType: 'contract IPPrincipalToken',
      },
      {
        name: '_YT',
        type: 'address',
        internalType: 'contract IPYieldToken',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'redeemRewards',
    inputs: [
      {
        name: 'user',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256[]',
        internalType: 'uint256[]',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'rewardState',
    inputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: 'index',
        type: 'uint128',
        internalType: 'uint128',
      },
      {
        name: 'lastBalance',
        type: 'uint128',
        internalType: 'uint128',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'skim',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'swapExactPtForSy',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'exactPtIn',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'data',
        type: 'bytes',
        internalType: 'bytes',
      },
    ],
    outputs: [
      {
        name: 'netSyOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netSyFee',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'swapSyForExactPt',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'exactPtOut',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'data',
        type: 'bytes',
        internalType: 'bytes',
      },
    ],
    outputs: [
      {
        name: 'netSyIn',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'netSyFee',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'symbol',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'string',
        internalType: 'string',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalActiveSupply',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalSupply',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'transfer',
    inputs: [
      {
        name: 'to',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'transferFrom',
    inputs: [
      {
        name: 'from',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'to',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'userReward',
    inputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: 'index',
        type: 'uint128',
        internalType: 'uint128',
      },
      {
        name: 'accrued',
        type: 'uint128',
        internalType: 'uint128',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'Approval',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'spender',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'value',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Burn',
    inputs: [
      {
        name: 'receiverSy',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'receiverPt',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'netLpBurned',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netSyOut',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netPtOut',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'IncreaseObservationCardinalityNext',
    inputs: [
      {
        name: 'observationCardinalityNextOld',
        type: 'uint16',
        indexed: false,
        internalType: 'uint16',
      },
      {
        name: 'observationCardinalityNextNew',
        type: 'uint16',
        indexed: false,
        internalType: 'uint16',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Mint',
    inputs: [
      {
        name: 'receiver',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'netLpMinted',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netSyUsed',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netPtUsed',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'RedeemRewards',
    inputs: [
      {
        name: 'user',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'rewardsOut',
        type: 'uint256[]',
        indexed: false,
        internalType: 'uint256[]',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Swap',
    inputs: [
      {
        name: 'caller',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'receiver',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'netPtOut',
        type: 'int256',
        indexed: false,
        internalType: 'int256',
      },
      {
        name: 'netSyOut',
        type: 'int256',
        indexed: false,
        internalType: 'int256',
      },
      {
        name: 'netSyFee',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'netSyToReserve',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Transfer',
    inputs: [
      {
        name: 'from',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'to',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'value',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'UpdateImpliedRate',
    inputs: [
      {
        name: 'timestamp',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'lnLastImpliedRate',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'MarketExchangeRateBelowOne',
    inputs: [
      {
        name: 'exchangeRate',
        type: 'int256',
        internalType: 'int256',
      },
    ],
  },
  {
    type: 'error',
    name: 'MarketExpired',
    inputs: [],
  },
  {
    type: 'error',
    name: 'MarketInsufficientPtForTrade',
    inputs: [
      {
        name: 'currentAmount',
        type: 'int256',
        internalType: 'int256',
      },
      {
        name: 'requiredAmount',
        type: 'int256',
        internalType: 'int256',
      },
    ],
  },
  {
    type: 'error',
    name: 'MarketInsufficientPtReceived',
    inputs: [
      {
        name: 'actualBalance',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'requiredBalance',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'MarketInsufficientSyReceived',
    inputs: [
      {
        name: 'actualBalance',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'requiredBalance',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'MarketProportionMustNotEqualOne',
    inputs: [],
  },
  {
    type: 'error',
    name: 'MarketProportionTooHigh',
    inputs: [
      {
        name: 'proportion',
        type: 'int256',
        internalType: 'int256',
      },
      {
        name: 'maxProportion',
        type: 'int256',
        internalType: 'int256',
      },
    ],
  },
  {
    type: 'error',
    name: 'MarketRateScalarBelowZero',
    inputs: [
      {
        name: 'rateScalar',
        type: 'int256',
        internalType: 'int256',
      },
    ],
  },
  {
    type: 'error',
    name: 'MarketScalarRootBelowZero',
    inputs: [
      {
        name: 'scalarRoot',
        type: 'int256',
        internalType: 'int256',
      },
    ],
  },
  {
    type: 'error',
    name: 'MarketZeroAmountsInput',
    inputs: [],
  },
  {
    type: 'error',
    name: 'MarketZeroAmountsOutput',
    inputs: [],
  },
  {
    type: 'error',
    name: 'MarketZeroLnImpliedRate',
    inputs: [],
  },
  {
    type: 'error',
    name: 'MarketZeroTotalPtOrTotalAsset',
    inputs: [
      {
        name: 'totalPt',
        type: 'int256',
        internalType: 'int256',
      },
      {
        name: 'totalAsset',
        type: 'int256',
        internalType: 'int256',
      },
    ],
  },
] as const
