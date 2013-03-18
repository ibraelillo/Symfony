/**
 * Created with JetBrains PhpStorm.
 * User: Ibrael
 * Date: 15/03/13
 * Time: 17:40
 * To change this template use File | Settings | File Templates.
 */

var App = App || {};
App.collection = null;
App.router = null;
App.getActiveCollection= function(){
    if(this.collection == null){
        this.collection = new App.Gites();
    }
    return this.collection;
};
App.loading = function(){
    new App.LoadingView().render();
};

App.loaded = function(){
    new App.LoadingView().destroy();
};


App.init = function(){
    new App.NavbarView();

    this.getActiveCollection().on('request', this.loading, this);
    this.getActiveCollection().on('sync', this.loaded, this);


    this.getActiveCollection().fetch({
        success: function(collection, response, options){
            this.router = new App.Router({ collection: this.collection });
            Backbone.history.start({root: '/'});
        }
    });
};

App.Tarifa = Backbone.Model.extend();
App.Gallery = Backbone.Model.extend();
App.Reservacion = Backbone.Model.extend({
   defaults: {
       user: null,
       start: '',
       end: '',
       location: ''
   },
   url: function(){
       return this.get('url') ? this.get('url') : this.collection.url;
   }
});
App.Location = Backbone.Model.extend({
    reservaciones: [],
    initialize: function(){
        this.reservaciones = new App.ReservacionesCollection(this.get('reservaciones'));

        if(this.get('capacidad') > 1 && this.get('capacidad') < 6)
            this.set('clasif', 'lite');
        else if (this.get('capacidad') >= 5 && this.get('capacidad') < 9)
            this.set('clasif', 'standard');
        else
            this.set('clasif', 'pro');

    },
    defaults: {
        reservaciones: [],
        cocina: true,
        piscina: true,
        clasif: 'standard'
    },
    urlRoot: function(){
        return this.get('url') ? this.get('url') : this.collection.url + this.get('id');
    }
});

App.ReservacionesCollection = Backbone.Collection.extend({
    model: App.Reservacion
})

App.Gites = Backbone.Collection.extend({
    model: App.Location,
    url: App.Settings.urlLocations,
    findOneBySlug: function(slug){
        return this.where({ slug: slug})[0];
    }
});

// Views

App.View = Backbone.View.extend({
   destroy: function(){
       this.$el.empty();
       this.stopListening();
       return this;
   }
});

App.LoadingView = App.View.extend({
    initialize: function(){
        this.el = $(App.container);
    },
    render: function(){
        console.log("Loading...");

        $("<div/>").attr({ id: 'overlay'}).html(
            '<img id="img-load" src="'+ App.Settings.ajax_loader +'" />'
        ).appendTo('body');


        $("#overlay").css({
            opacity : 0.5,
            top     : this.el.offset().top,
            width   : this.el.outerWidth(),
            height  : this.el.outerHeight()
        });

        $("#img-load").css({
            top  : (this.el.height() / 2),
            left : (this.el.width() / 2)
        });

        $("#overlay").fadeIn();
    },
    destroy: function(){
        console.log('Loaded!');
        $("#overlay").fadeOut().remove();
        this.remove();
    }
});


/************ portada *****************************/
App.ItemView = Backbone.View.extend({
    'tagName': 'div',
    'className': '',
    //template: _.template($('#location-features').html()),
    initialize: function() {
        _.bindAll(this);

        this.model.on('change', this.render, this);
        this.model.on('destroy', this.destroy, this);

        this.el = $(this.el);

        this.tagName = this.options.tagName ? this.options.tagName : 'div';
        this.className = this.options.className ? this.options.className : '';

        if(this.options.template_name)
            this.template = _.template($(this.options.template_name).html());

    },
    destroy: function(){
        _.unbind(this);
    },
    render:function () {
        if(!this.options.template_name)
            console.log("No se ha definido una plantilla para esta vista");
        else
            this.el.html(this.template(this.model.toJSON()));

        return this;
    }
});
App.SliderView = App.View.extend({
    initialize:function () {
        this.el = $(this.el);

        this.collection.on("reset", this.render, this);
        this.collection.on('change', this.render, this);
        this.collection.on("add", this.render, this);
    },
    render: function(){
        this.el.html("");
        var row = $('<div/>').addClass('carousel-inner');

        var  i = 0;
        _.each(this.collection.models, function (model) {
            row.append((new App.ItemView({
                model: model,
                collection: this.collection,
                template_name: "#location-slide",
                tagName: 'div',
                className: ( i == 0 ? 'active ': '') +'item slide'+(i+1)
            }).render().el));
            i++;
        }, this);
        var container = $('<div/>').addClass('container').append(
            '<div class="row animated fadeInDown">' +
                '   <div class="span12">' +
                '       <div id="myCarousel" class="carousel slide"></div>' +
                '       <a class="carousel-control left" href="#myCarousel" data-slide="prev">&lsaquo;</a>' +
                '       <a class="carousel-control right" href="#myCarousel" data-slide="next">&rsaquo;</a>' +
                '   </div>' +
                '</div>'
        );
        this.el.append(container);



        $('#myCarousel').append(row).carousel('cycle');

        return this;
    }
});
App.FeaturesView = App.View.extend({
    initialize:function () {
        this.el = $(this.el);
        this.collection.on("reset", this.render, this);
        this.collection.on('change', this.render, this);
        this.collection.on("add", this.render, this);
        //if(this.collection.length <= 0)
        //this.populate();
    },
    render: function() {
        this.el.html("");
        var container = $('<div/>').addClass('container').append(
            '<h2 class="section_header"><hr class="left visible-desktop"><span>Locations '+
                (this.collection.length > 3 ? '<small>' + (this.collection.length - 3) + ' plus sont disponibles.</small>':'') +
            '</span><hr class="right visible-desktop"></h2>'
        );

        this.el.append(container.hide().fadeIn('slow'));

        var row = $('<div/>').attr('id', "rowFeatures").addClass('row');

        container.append(row.hide().fadeIn('slow'));

        var  i = 0;
        _.each(this.collection.models, function (model) {
            if(i++ >= 3) return;
            row.append((new App.ItemView({
                model: model,
                collection: this.collection,
                template_name: "#location-features",
                tagName: 'div',
                className: 'span4 feature'
            })).render().el.hide().fadeIn(2000, 'linear'));
        }, this);
        return this;
    }
});
App.PricesView = App.View.extend({
    initialize: function(){
        _.bindAll(this);

        this.el = $(this.el);

        this.collection.on('reset', this.render, this);
        this.collection.on('change', this.render, this);
    },
    render: function(){
        this.el.html("");
        var container = $('<div/>').addClass('container').append(
            '<h2 class="section_header">' +
                '<hr class="left visible-desktop">' +
                '<span>Prix</span>' +
                '<hr class="right visible-desktop">' +
                '</h2>'
        );

        this.el.append(container.hide().fadeIn('slow'));
        var row = $('<div/>').addClass('row');
        container.append(row.hide().fadeIn('slow'));

        var copy = this.collection.slice(0,3);
        copy.push(copy.shift());
        copy.push(copy.shift());

        _.each(copy, function (model) {
            row.append((new App.ItemView({
                model: model,
                collection: this.collection,
                template_name: "#location-pricing",
                className: 'span4'
            })).render().el.hide().fadeIn(2000, 'linear'));
        }, this);
        return this;
    }
});
App.PortadaView = App.View.extend({
    initialize:function () {
        this.el = $(this.el);
        _.bindAll(this);

        //this.collection = new App.Gites();

        this.collection.on("destroy", this.destroy, this);
        this.collection.on("request", this.loading, this);
        this.collection.on("sync", this.loaded, this);
        //this.collection.on("sync", this.updateView, this);

        this.render();
        this.updateView();
        //this.collection.fetch();
    },
    updateView: function(){
        new App.SliderView({ collection: this.collection, el: $("#hero")}).render();
        new App.FeaturesView({ collection: this.collection, el: $("#features") }).render();
        new App.PricesView({ collection: this.collection, el: $("#pricing")}).render();
    },
    render: function(){
        this.el.html("");
        $('<div/>').attr('id','hero').appendTo(this.el);
        this.el.append('<div id="intro"><div class="container"><h1>...vos vacances toute l\' ann&eacute;e à prix canons! </h1></div></div>');
        $('<div/>').attr('id','features').appendTo(this.el);
        $('<div/>').attr('id','pricing').appendTo(this.el);

        return this;
    }
});
/************* fin de la portada *****************************/


/************* todas las locationes **************************/
App.SidebarView = App.View.extend({
    initialize: function(){
        _.bindAll(this);
        this.el = $(this.el);

        if(this.collection == null && this.model.collection != null)
            this.collection = this.model.collection;

        this.el = $('<div/>').addClass(this.className);
    },
    render: function(){
        var buscador = '<input type="text" class="input-large search-query" placeholder="Chercher">';

        var section;

        var secciones = new Array();

        if(this.model.collection != null){
            var that = this;
            section =    '<h4 class="sidebar_header">Autres locations</h4><ul class="sidebar_menu">';
            _.each(this.collection.models, function(model){
                if(that.model.id != model.id)
                    section += '   <li><a href="#!/location/'+ model.get('slug')+'">'+ model.get('nombre')+'</a></li>';
            });

            section +=     '</ul>';
            secciones.push(section);
        }


        this.el.append( buscador);
        var self = this;
        _.each(secciones, function(sec){
           self.el.append(sec);
        });
        /*        '<h4 class="sidebar_header">Recent posts</h4>' +
                '    <ul class="recent_posts">' +
                '        <li>' +
                '           <div class="row">' +
                '               <div class="span1">' +
                '                   <a href="blog-post.html">' +
                '                       <img class="thumb" alt="thumb post" src="img/pic_blog.png" />' +
                '                   </a>' +
                '               </div>' +
                '                <div class="span2">' +
                '                   <a class="link" href="blog-post.html">Suspendisse Semper Ipsum</a>' +
                '                </div>' +
                '            </div>' +
                '        </li>'+
                '</ul>' +
                '  </div>'*/
        //);
        return this;
    }
});

App.LocationsView = App.View.extend({
    initialize: function(){
        _.bindAll(this);
        this.el = $(this.el);

        this.collection.on('change', this.render, this);
        this.collection.on('reset', this.render, this);

        //this.collection.fetch();

        this.render();
    },
    render: function(){
        var row = $('<div/>').addClass('span8');

        _.each(this.collection.models, function(model){
            row.append(
                new App.ItemView({
                    model: model,
                    collection: this.collection,
                    template_name: "#location-preview",
                    tagName: 'div',
                    className: 'post'
                }).render().el
            );
        });



        this.el.html("").append(
            '<div id="blog_wrapper">' +
            '   <div class="container">' +
            '       <div class="row">' +
            '           <div class="span8">' +
            '               <h1 class="header">Locations <hr></h1>'+
                            row.html() +
            '           </div>' +
                new App.SidebarView({
                    model: this.collection.at(0),
                    collection: this.collection,
                    className: 'span3 sidebar offset1'
                }).render().el.html() +
            '       </div>' +
            '   </div>' +
            '</div>'
        );
    }
});


App.LocationDetailView = Backbone.View.extend({
   initialize: function(){
       _.bindAll(this);
       this.el = $(this.el);
       this.model.on('change', this.render, this);
       this.model.on('reset', this.render, this);

       this.render();
   },
   render: function(){
       var row = $('<div/>').addClass('span8');

           row.append(
               new App.ItemView({
                   model: this.model,
                   collection: this.collection,
                   template_name: "#location-detail",
                   tagName: 'div'
               }).render().el
           );

       var sidebar = $('<div>').html(
           '<div class="span3 sidebar offset1">' +
               '<input type="text" class="input-large search-query" placeholder="Chercher">' +
               '<h4 class="sidebar_header">Menu</h4>' +
               '<ul class="sidebar_menu">' +
               '   <li><a href="#">Suspendisse Semper Ipsum</a></li>' +
               '   <li><a href="#">Maecenas Euismod Elit</a></li>' +
               '   <li><a href="#">Suspendisse Semper Ipsum</a></li>' +
               '   <li><a href="#">Maecenas Euismod Elit</a></li>' +
               '   <li><a href="#">Suspendisse Semper Ipsum</a></li>' +
               '</ul>' +
               '<h4 class="sidebar_header">Recent posts</h4>' +
               '    <ul class="recent_posts">' +
               '        <li>' +
               '           <div class="row">' +
               '               <div class="span1">' +
               '                   <a href="blog-post.html">' +
               '                       <img class="thumb" alt="thumb post" src="img/pic_blog.png" />' +
               '                   </a>' +
               '               </div>' +
               '                <div class="span2">' +
               '                   <a class="link" href="blog-post.html">Suspendisse Semper Ipsum</a>' +
               '                </div>' +
               '            </div>' +
               '        </li>'+
               '</ul>' +
               '  </div>'
       );

       this.el.html("").append(
           '<div id="blog_wrapper" class="blog_post">' +
               '   <div class="container">' +
               '       <div class="row">' +
               '           <div class="span8">' +
                                row.html() +
               '           </div>' + sidebar.html()+
               '       </div>' +
               '   </div>' +
               '</div>'
       );

       $('#myCarousel').carousel('cycle');
   }
});

App.ReservationView = App.View.extend({
    initialize: function(){
        _.bindAll(this);
    }
});

/***************navbar *****************************/
App.NavbarView = Backbone.View.extend({
    el: $('body'),
    initialize: function(){
        this.el = $(this.el);

        this.render();
    },
    render: function(){
        this.el.prepend(
            '<a href="#" class="scrolltop"><span>up</span></a>' +
                '<div class="navbar navbar-fixed-top" id="barra">' +
                '    <div class="navbar-inner">' +
                '        <div class="container">' +
                '           <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">' +
                '              <span class="icon-bar"></span>' +
                '              <span class="icon-bar"></span>' +
                '              <span class="icon-bar"></span>' +
                '           </a>' +
                '           <a class="brand scroller" data-section="body" href="#!/home">' +
                '               <img src="'+ App.Settings.logo +'" alt="logo" />' +
                '           </a>' +
                '           <div class="nav-collapse collapse">' +
                '                <ul class="nav pull-right">' +
                '                   <li><a href="#!/locations" class="scroller" data-section="#home">Locations</a></li>' +
                '                   <li><a href="#!/contact" class="scroller" data-section="#footer">Contact</a></li>  ' +
                '                   <li><a class="btn-header" href="#!/signup">Sign up</a></li>' +
                '                   <li><a class="btn-header" href="#!/signin">Sign in</a></li>' +
                '                </ul>' +
                '             </div>' +
                '        </div>' +
                '    </div>' +
                '</div>'
        );
    }
});



App.Router = Backbone.Router.extend({

    viewActive: null,
    routes: {
        '!/home' : 'homeAction',
        '!/contact': 'contactAction',
        '!/location/:slug': 'locationAction',
        '!/location/:slug/reservar': 'reservarAction',
        '!/locations' : 'allAction'
    },

    clearView: function(){
        if(this.viewActive instanceof App.View)
            this.viewActive.destroy();

        return this;
    },

    reservarAction: function(slug){
        var model = App.getActiveCollection().findOneBySlug(slug);
        this.clearView().viewActive = new App.ReservationView({
              model: model,
               el: $(App.container)
        });
    },
    homeAction: function(){
        this.clearView().viewActive = new App.PortadaView({
            collection: App.collection,
            el: $(App.container)});
    },
    contactAction: function(){
        alert('contact');
    },

    allAction: function(){
        this.clearView().viewActive= new App.LocationsView({
            el: $('#content'),
            collection: App.getActiveCollection()
        });
    },

    locationAction: function(slug){

        var model = App.getActiveCollection().findOneBySlug(slug);

        this.clearView().viewActive= new App.LocationDetailView({
            model: model,
            collection: App.getActiveCollection(),
            el: $(App.container)
        });
    }
});