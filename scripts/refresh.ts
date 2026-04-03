import { refreshSolutions } from '../lib/solutions';

async function main() {
  const items = await refreshSolutions();
  const byPartner = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.partner] = (acc[item.partner] ?? 0) + 1;
    return acc;
  }, {});

  const byType = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.type] = (acc[item.type] ?? 0) + 1;
    return acc;
  }, {});

  console.log(`Updated ${items.length} solutions`);
  console.table({ byPartner, byType });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
