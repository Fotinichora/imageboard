// this is where our Vue code

(function() {



  Vue.component("image-modal", {
      props: ["imageId"],
      template: "#modal-template",
      data: function() {
        return {
          url: "",
          title: "",
          description: "",
          created_at: "",
          comments: [],
          form: {
            comment: "",
            username: ""
          }
        };
      },

      methods: {
        postComment: function(e) {
          e.preventDefault();
          var self = this;
          axios.post("/comments", {
            comment: this.form.comment,
            username: this.form.username,
            image_id: this.imageId,

          }).then(data => {
            console.log(data)
            // i refesrh the comments
            axios
              .get('/comments/' + self.imageId)
              .then(function(resp) {
                self.comments = resp.data;
                console.log(resp.data)
              }).catch(function(err) {
                console.log("err: ", err);
              });
          });

        }
      },

      //i have to pass the image id
      mounted: function() {
        var self = this;
        axios
          .get('/images/' + self.imageId)
          .then(function(resp) {
            self.description = resp.data.description;
            self.url = resp.data.url;
            self.title = resp.data.title;
            self.created_at = resp.data.created_at;
            console.log(resp.data)
          }).catch(function(err) {
            console.log("err: ", err);
          });
        axios
          .get('/comments/' + self.imageId)
          .then(function(resp) {
            self.comments = resp.data;
            console.log(resp.data)
          }).catch(function(err) {
            console.log("err: ", err);
          });
      },

      // function() {
      //   var self = this;
      //   axios
      //     .get('one/image/' + self.image_id)
      //     .then(function(resp) {
      //
      //     }).catch(function(err) {
      //       console.log("err:", err);
      //     })
      // },





    }),

    new Vue({
      el: '#main',

      data: {

        image_id: false,
        images: [],
        currentImage: null,
        form: {
          title: "",
          username: "",
          description: "",
          file: null
        }
      },

      // data ends

      mounted: function() {
        // then function runs once we've received response from server
        var self = this;
        axios
          .get('/get-images') //+ image.id
          .then(function(resp) {
            // console.log('response from server', resp.data);
            // console.log('SELF in then of axios', self);
            //runs once we recieved response from server
            self.images = resp.data;
            //self == this
          })
          .catch(function(err) {
            console.log('err', err);
          });
      },

      methods: {
        handleFileChange: function(e) {
          //console.log("data from e ", e);
          this.form.file = e.target.files[0];
        },
        open: function(image_id) {
          //console.log("Id of the image: ", image_id); //set the Id
          this.image_id = image_id;
        },
        close: function() { // Set the ID to null and dissapear
          this.image_id = null;
        },

        openCurrentImage: function(image_id) {
          this.image_id = image_id;
          // console.log("data:", image_id); //i can see the image_id YES!
        },

        // getElementById: function(image_id) {
        //   this.image_id = image_id;
        //   consoloe.log("id:", url)
        // }



        uploadFile: function(e) {
          e.preventDefault();
          var formData = new FormData();
          var self = this;
          formData.append("file", this.form.file);
          formData.append("title", this.form.title);
          formData.append("description", this.form.description);
          formData.append("username", this.form.username);

          axios.post("/upload", formData).then(data => {
            //console.log(data)
            self.images.unshift(data.data[0]); // Post images
          });
        }

      }
    });

})();
