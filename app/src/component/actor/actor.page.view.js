define(function (require) {

    'use strict';

    var Backbone = require('backbone'),
        Nunjucks = require('nunjucks'),
        Moment = require('moment'),
        template = 'actor.page.nunj.html',
        Actor = require('actor.model'),
        MoviesView = require('actor.movies.view'),
        TMDb = require('TMDbSearch');

    return Backbone.View.extend({
        events: function () {
            return {
                'click .media .unorderedMoviesList .item--trailerButton ': 'showTrailerModal',
                'click #showTrailerModal .closeButton': 'closeTrailerModal',
                'click .mediaSection--hideShowButton': 'toggleMediaSection'
            }
        },

        render: function (id) {
            var self = this;
            var actor = new Actor({artistId: id});
            actor.fetch({
                success: function (result) {
                    var actor = result.toJSON();

                    TMDb.searchActor(actor.artistName, function (tmdbActor) {

                        self.display({
                            name: actor.artistName,
                            primaryGenre: actor.primaryGenreName,
                            iTunesLink: actor.artistLinkUrl,
                            biography: tmdbActor.biography,
                            img: tmdbActor.img,
                            birthday: tmdbActor.birthday,
                            placeOfBirth: tmdbActor.placeOfBirth,
                            homepage: tmdbActor.homepage
                        });
                        var moviesView = new MoviesView({el: self.$('.actor--movies')});
                        moviesView.render(id);

                        self.hideMediaSectionForSmallScreen();
                    });

                    self.changePageTitleWith(actor.artistName);
                }
            });
            return this;
        },

        toggleMediaSection: function(event) {
            this.toggleMediaSectionParentOfElement($(event.currentTarget));
        },

        display: function (options) {
            var self = this;
            var html = Nunjucks.render(template, {
                media: {
                    title: options.name,
                    img: options.img,
                    mainInformations: [
                        self._formatBirth(options.birthday, options.placeOfBirth),
                        'Primary genre : ' + options.primaryGenre
                    ],
                    biography: options.biography,
                    itunesLink: options.iTunesLink,
                    homepage: options.homepage
                }
            });
            self.$el.html(html);
        },

        showTrailerModal: function (event) {
            var button = $(event.currentTarget);

            $('#showTrailerModal .modal--trailerVideo', this.el).attr('src', button.attr('data-trailer-link'));
            $('#showTrailerModal', this.el).openModal();
        },

        closeTrailerModal: function () {
            $('#showTrailerModal', this.el).closeModal();
        },

        _formatBirth: function (date, place) {
            var day = Moment(date);
            var str = 'Born ';
            str += day.isValid() ? day.format('LL') + ' ' : '';
            str += place ? 'in ' + place : 'on Earth';

            return str;
        }
    });
});
