import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear old data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.restaurant.deleteMany();

  const testy = await prisma.restaurant.create({
    data: {
      name: "Testy Vibes",
      image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
      rating: 4.0,
      deliveryTime: "45-50 mins",
      isVeg: true,
    },
  });

  const spicy = await prisma.restaurant.create({
    data: {
      name: "Spicy Hub",
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349",
      rating: 4.3,
      deliveryTime: "30-40 mins",
      isVeg: false,
    },
  });

  // Add menu items
  await prisma.menuItem.createMany({
    data: [
      {
        name: "Veg Burger",
        price: 120,
        image: "",
        restaurantId: spicy.id,
      },
      {
        name: "Cheese Pizza",
        price: 250,
        image: "",
        restaurantId: spicy.id,
      },
      {
        name: "Paneer Wrap",
        price: 180,
        image: "",
        restaurantId: testy.id,
      },
      {
        name: "Cold Coffee",
        price: 90,
        image: "",
        restaurantId: testy.id,
      },
    ],
  });

  console.log("Seeded successfully 🌱");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
