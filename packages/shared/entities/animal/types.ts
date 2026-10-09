export interface AnimalType {
  name: string;
  imageUrl: string;
  description: string;
  breeds: {
    name: string;
  }[];
}
