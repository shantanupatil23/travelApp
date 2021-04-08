import http from "../http-common";

class DealsService {
  getDeals(source, destination) {
    return http.get(
      `/travel/find-route/source=${source}&destination=${destination}`
    );
  }
  getPlaces(from) {
    return http.get(`/travel/places`);
  }
}

export default new DealsService();
