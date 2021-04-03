import http from "../http-common";

class DealsService {
  getDeals(source, destination, type) {
    return http.get(
      `/travel/find-route/source=${source}&destination=${destination}`
    );
  }
  getPlaces(from) {
    return http.get(`/travel/places/from=${from}`);
  }
}

export default new DealsService();
