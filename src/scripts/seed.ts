import { faker } from "@faker-js/faker"

import { db } from "@/db"
import { groups, products, users } from "@/db/schema"

const groupProducts = {
  FILES: [
    "FILE DE ANCHOVA -P- cx 14",
    "FILE DE ANCHOVA cx 14",
    "FILE DE CORVINA -P CX 14 KÇ",
    "FILE DE CORVINA -M CXS 14 KG",
    "FILE DE CORVINA -G  CX 14KG",
    "FILE DE  ESPADA BANDEJA CX 17 KG",
    "FILE DE  ESPADA  BANDEJA -G 17 KG",
    "FILE DE ESPADA BLOCO 16 KG SACO RAFIA",
    "FILE DE GORDINHO",
    "FILE DE GUAIVIRA  P CX 14 KG",
    "FILE DE GUAIVIRA -M-- CX 14 KG",
    "FILE DE GUAIVIRA  M-G CX 14 KG",
    "FILE DE GUAIVIRA - G- 14 KG  CX 14 KG",
    "FILE DE LAJE ESPALMADA PGT 1K CX 15 KG",
    "FILE DE MISTURA AGRANEL CX 14 KG",
    "FILE DE PARU  -M      14 KG",
    "FILE DE PESCADA BICUDA  CX 14 KG",
    "FILE DE SOROROCA CX 15 KG",
  ],
  LAJE: [
    "LAJE BLOCO 15 KG",
    "LAJE EVISC  SC S/PÇS CX 15KG",
    "LAJE EVISC  SC S/PÇS PCT DE 1 K CX 15KG",
    "LAJE  EVISC S/C 8/10   15 KG",
  ]
} as const;

type GroupName = keyof typeof groupProducts;

const products1StockIns  = [
  3,
  1,
  24,
  56,
  5,
  174,
  86,
  44,
  1,
  35,
  25,
  224,
  1,
  34,
  181,
  30,
  30,
  15,
];

const products2StockIns = [
  70,
  0,
  667,
  351,
];

async function main() {
  console.log("Seeding...");

  try {
    const userValues = [1,2].map(() => ({
      name: faker.person.fullName(),
      clerkId: faker.lorem.text(),
      email: faker.internet.email(),
    }));

    await db.insert(users).values(userValues);

    const groupNames = Object.keys(groupProducts)
    const groupValues = groupNames.map((name) => ({ name }))
    const insertedGroups = await db.insert(groups).values(groupValues).returning()

    const productValues = insertedGroups.flatMap((group) => { 
      const groupName = group.name as GroupName;
      const productNames = groupProducts[groupName] || [];
      return productNames.map((productName) => ({
        name: productName,
        groupId: group.id,
      }));
    });

    await db.insert(products).values(productValues);

    console.log("Db seeded successfully");
  } catch (error) {
    console.log("Error seeding: ", error);
    process.exit(1);
  }
}

main();