export interface News {
  id: number;
  by: string;
  descendants: string;
  kids: number[];
  score: number;
  time: number;
  title: string;
  type: string;
  url: string;
  karma: number;
}
