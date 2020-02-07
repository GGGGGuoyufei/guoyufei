<template>
    <div>

    </div>
</template>

<script>
    export default {
        name:"Scoket",
        data() {
            return {
                path:"",
            }
        },
        methods: {
            initWs() {
                if (typeof WebSocket === "undefined") {
                    alert("您的浏览器不支持socket");
                } else {
                    // 实例化socket
                    this.socket = new WebSocket(this.path);
                    // 监听socket连接
                    this.socket.onopen = this.open;
                    // 监听socket错误信息
                    this.socket.onerror = this.error;
                    // 监听socket消息
                    this.socket.onmessage = this.getMessage;
                }
            },
            open: function() {
                this.send(parseInt((Math.random() + 1) * Math.pow(10, 6 - 1)) + "");
                console.log("socket连接成功");
            },
            error: function() {
                console.log("连接错误");
            },
            getMessage: function(msg) {
                console.log(msg);
            },
            send: function(params) {
                this.socket.send(params);
            },
            close: function() {
                console.log("socket已经关闭");
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>