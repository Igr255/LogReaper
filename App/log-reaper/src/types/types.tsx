export type GrokPattern = {
  name: string;
  value: string;
};

export type MessagePatternData = {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  patterns: { type: number; value: string }[];
};

export type GrokPatternSet = {
  type: string;
  name: string;
  isActive: boolean;
};
