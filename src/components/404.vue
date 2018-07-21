<template>
  <div class="404">
    <div class="container">
      <div class="jumbotron">
        <h1>Error 404</h1>
        <h2>Page not found</h2>
        <p>The page you requested <router-link :to="{ path: $route.path }">{{ $route.path }}</router-link> could not be found.</p>
        <p>Please ensure you entered the correct URL or try navigating home</p>
        <p><router-link class="btn-default btn-lg" :to="{ path: '/' }" role="button">Return home</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
export default{
  data: function () {
    return {
    }
  },
  mounted () {
  }
}
</script>
