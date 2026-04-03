import { refreshSolutions } from '../lib/solutions';

async function main() {
  const items = await refreshSolutions();
  console.log(`Updated ${items.length} solutions`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
