export interface AnimalPreviewType {
  name: string;
  imageUrl: string;
  description: string;
  breeds: {
    name: string;
  }[];
}

export interface AnimalType {
  name: string;
  imageUrl: string;
  description: string;
  animalNames: string[];
  breeds: {
    name: string;
    description: string;
  }[];
}
