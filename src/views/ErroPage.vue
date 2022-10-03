<template>
  <div>
    <br>
    <div class="text-center">
      <router-link :to="{ name: 'home' }">
        <button class="btn btn-info">Vist Home Page</button>
      </router-link>
    </div>
    <br />

    <img
      class="rounded mx-auto d-block h400"
      src="../assets/PuXipAW3AXUzUJ4uYyxPKC-1200-80.jpeg"
      alt=""
    />
  </div>
</template>

<script>
export default {
  name: "ErroPage",
  components: {},
};
</script>

<style>
.h400 {
  height: 400px;
}
</style>