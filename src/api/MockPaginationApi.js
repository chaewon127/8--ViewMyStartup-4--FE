import MOCK_COMPANIES from "./mockCompanies";
import MOCK_INVESTED_COMPANIES from "../components/modals/mockInvestedCompanies";

export async function fetchCorpData({ offset, limit, order }) {
  return new Promise((resolve) => {
    // 문자열에서 숫자만 추출하여 파싱하는 헬퍼 함수
    const parseValue = (str) =>
      parseInt(String(str).replace(/[^0-9]/g, ""), 10) || 0;

    // 데이터 정렬
    let sortedData = [...MOCK_COMPANIES];
    switch (order) {
      case "investmentLowest":
        sortedData.sort(
          (a, b) => parseValue(a.investment) - parseValue(b.investment)
        );
        break;
      case "investmentHighest":
        sortedData.sort(
          (a, b) => parseValue(b.investment) - parseValue(a.investment)
        );
        break;
      case "salesLowest":
        sortedData.sort(
          (a, b) => parseValue(a.revenue) - parseValue(b.revenue)
        );
        break;
      case "salesHighest":
        sortedData.sort(
          (a, b) => parseValue(b.revenue) - parseValue(a.revenue)
        );
        break;
      case "employeeLowest":
        sortedData.sort(
          (a, b) => parseValue(a.employees) - parseValue(b.employees)
        );
        break;
      case "employeeHighest":
        sortedData.sort(
          (a, b) => parseValue(b.employees) - parseValue(a.employees)
        );
        break;
      default:
        sortedData.sort((a, b) => b.total_investment - a.total_investment);
    }

    // 페이지네이션
    const paged = sortedData.slice(offset, offset + limit);

    // 응답 객체 반환
    resolve({
      data: paged,
      totalCount: sortedData.length,
    });
  });
}

export async function fetchInvestedCompanies() {
  return new Promise((resolve) => resolve({ data: MOCK_INVESTED_COMPANIES }));
}
