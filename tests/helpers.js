

// Add resolutionOptions as query parameters to a base URL
export function addQueryParametersToUrl(baseUrl, resolutionOptions = {}) {
  const url = new URL(baseUrl);
  for(const [key, value] of Object.entries(resolutionOptions)) {
    url.searchParams.append(key, value);
  }
  return url.toString();
}
