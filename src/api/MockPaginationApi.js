export async function fetchCorpData({ offset, limit, order }) {
  return new Promise((resolve) => {
    const MOCK_DATA = Array.from({ length: 100 }, (_, i) => ({
      name: `Corp ${i + 1}`,
      total_investment: Math.floor(Math.random() * 10000),
      corp_sales: Math.floor(Math.random() * 5000),
      employee: Math.floor(Math.random() * 200),
    }));

    let sortedData = [...MOCK_DATA];
    switch (order) {
      case "investmentLowest":
        sortedData.sort((a, b) => a.total_investment - b.total_investment);
        break;
      case "investmentHighest":
        sortedData.sort((a, b) => b.total_investment - a.total_investment);
        break;
      case "salesLowest":
        sortedData.sort((a, b) => a.corp_sales - b.corp_sales);
        break;
      case "salesHighest":
        sortedData.sort((a, b) => b.corp_sales - a.corp_sales);
        break;
      case "employeeLowest":
        sortedData.sort((a, b) => a.employee - b.employee);
        break;
      case "employeeHighest":
        sortedData.sort((a, b) => b.employee - a.employee);
        break;
      default:
        sortedData.sort((a, b) => b.total_investment - a.total_investment);
    }

    const paged = sortedData.slice(offset, offset + limit);

    resolve({
      data: paged,
      totalCount: sortedData.length,
    });
  });
}
