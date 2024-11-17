export interface Cigar {
  id: number;
  name: string;
  brand: string;
  quantity: number;
  imageUrl?: string;
}

export interface Humidor {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  cigars: Cigar[];
  type: string;
}

export const EXAMPLE_HUMIDORS: Humidor[] = [
  {
    id: 1,
    name: "Daily Smokes",
    description: "My everyday cigars collection",
    type: "regular",
    cigars: [
      {
        id: 1,
        name: "Montecristo No. 2",
        brand: "Montecristo",
        quantity: 5,
      },
      {
        id: 2,
        name: "Cohiba Robusto",
        brand: "Cohiba",
        quantity: 3,
      },
      {
        id: 3,
        name: "Romeo y Julieta Short Churchill",
        brand: "Romeo y Julieta",
        quantity: 4,
      },
      {
        id: 4,
        name: "Hoyo de Monterrey Epicure No. 2",
        brand: "Hoyo de Monterrey",
        quantity: 3,
      },
      {
        id: 5,
        name: "Partagas Serie D No. 4",
        brand: "Partagas",
        quantity: 6,
      },
      {
        id: 6,
        name: "H. Upmann Half Corona",
        brand: "H. Upmann",
        quantity: 8,
      },
      {
        id: 7,
        name: "Trinidad Reyes",
        brand: "Trinidad",
        quantity: 4,
      },
      {
        id: 8,
        name: "Bolivar Royal Corona",
        brand: "Bolivar",
        quantity: 5,
      },
      {
        id: 9,
        name: "Montecristo Edmundo",
        brand: "Montecristo",
        quantity: 3,
      },
      {
        id: 10,
        name: "Ramon Allones Specially Selected",
        brand: "Ramon Allones",
        quantity: 2,
      },
      {
        id: 11,
        name: "Vegas Robaina Unicos",
        brand: "Vegas Robaina",
        quantity: 1,
      },
      {
        id: 12,
        name: "Montecristo Edmundo",
        brand: "Montecristo",
        quantity: 3,
      },
      {
        id: 13,
        name: "Ramon Allones Specially Selected",
        brand: "Ramon Allones",
        quantity: 2,
      },
      {
        id: 14,
        name: "Vegas Robaina Unicos",
        brand: "Vegas Robaina",
        quantity: 1,
      },
    ],
  },
  {
    id: 2,
    name: "Special Occasion",
    description: "Premium cigars for celebrations",
    type: "regular",
    cigars: [
      {
        id: 15,
        name: "Padron 1926 Series No. 9",
        brand: "Padron",
        quantity: 2,
      },
      {
        id: 16,
        name: "Opus X Lost City",
        brand: "Arturo Fuente",
        quantity: 1,
      },
      {
        id: 17,
        name: "Cohiba Behike 52",
        brand: "Cohiba",
        quantity: 2,
      },
    ],
  },
  {
    id: 3,
    name: "Aging Collection",
    description: "Cigars being aged for future enjoyment",
    type: "aging",
    cigars: [
      {
        id: 18,
        name: "Davidoff Grand Cru No. 3",
        brand: "Davidoff",
        quantity: 4,
      },
      {
        id: 19,
        name: "Trinidad Fundadores",
        brand: "Trinidad",
        quantity: 2,
      },
    ],
  },
  {
    id: 4,
    name: "Trading Stock",
    description: "Cigars available for trading",
    type: "trading",
    cigars: [
      {
        id: 20,
        name: "Montecristo Edmundo",
        brand: "Montecristo",
        quantity: 3,
      },
      {
        id: 21,
        name: "Ramon Allones Specially Selected",
        brand: "Ramon Allones",
        quantity: 2,
      },
      {
        id: 22,
        name: "Vegas Robaina Unicos",
        brand: "Vegas Robaina",
        quantity: 1,
      },
    ],
  },
];
