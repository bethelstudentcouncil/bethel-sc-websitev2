export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/admin" || url.pathname === "/admin/") {
      const target = new URL(request.url);
      target.pathname = "/admin.html";
      return Response.redirect(target.toString(), 302);
    }

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Not Found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=UTF-8" }
    });
  }
};
