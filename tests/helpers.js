

// Add resolutionOptions as query parameters to a base URL
export function addQueryParametersToUrl(baseUrl, parameters = {}) {
  const url = new URL(baseUrl);
  for(const [key, value] of Object.entries(parameters)) {
    url.searchParams.append(key, value);
  }
  return url.toString();
}
