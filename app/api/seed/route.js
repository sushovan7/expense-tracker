import { seedTransactions } from "@/actions/seed";

export async function GET() {
  const result = await seedTransactions();
  console.log(result);

  // Correctly return a JSON response using the Response constructor
  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" },
    status: result.success ? 200 : 500, // Set appropriate status codes
  });
}
