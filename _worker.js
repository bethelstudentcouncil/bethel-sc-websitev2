export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/admin") {
      return env.ASSETS.fetch(new Request(new URL("/admin.html", request.url)));
    }

    return env.ASSETS.fetch(request);
  },
};
