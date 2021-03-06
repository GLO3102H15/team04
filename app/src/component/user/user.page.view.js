define(function (require) {

    'use strict';

    var Backbone = require('backbone'),
        Nunjucks = require('nunjucks'),
        Common = require('/js/common.js'),
        UserModel = require('user.model'),
        WatchListsView = require('user.watchlists.view'),
        template = 'user.page.nunj.html';

    return Backbone.View.extend({

        events: {
            'click .followBtn': 'toggleFollowUser',
            'click .mediaSection--hideShowButton': 'toggleMediaSection'
        },

        initializeWithId: function(id) {
            this.model = new UserModel({id: id});
            this.listenTo(this.model, 'change', this.render);
            this.model.fetch({data:{access_token:$.cookie(Common.LOGIN_TOKEN_COOKIE)}});
        },

        render: function() {
            var self = this;
            var isNotCurrentUser = undefined;

            if(self.model.id != $.cookie(Common.CURRENT_USER_ID)) {
                isNotCurrentUser = true;
            }
            var html = Nunjucks.render(template, {
                media:{
                    title: self.model.get('name'),
                    img: '/image/user_icon.png',
                    mainInformations: [
                        'Email: ' + self.getEscapedString(self.model.get('email'))
                    ],
                    isNotCurrentUser: isNotCurrentUser,
                    friends: self.parseFriendsList()
                }
            });
            this.$el.html(html);
            this.changePageTitleWith('User');

            var watchlistsViews = new WatchListsView({el: self.$('.watchlistsContainer')});
            watchlistsViews.render(self.model.id);
            this.updateFollowingBtn();
            return this;
        },

        toggleFollowUser: function() {
            var self = this;
            if(self.$('.followBtn').hasClass('unfollowBtn')){
                self.model.unFollow(function(){
                    self.updateFollowingBtn();
                });
            }
            else{
                this.model.follow(function(){
                    self.updateFollowingBtn();
                });
            }
        },

        toggleMediaSection: function(event) {
            this.toggleMediaSectionParentOfElement($(event.currentTarget));
        },

        parseFriendsList : function() {
            var self = this;
            if(self.model.get('following')){
                //to avoid getting old invalid entries
                var filterdList = _.filter(self.model.get('following'),function(friend){
                    return typeof(friend.id) != 'undefined';
                });

                return _.map(filterdList, function(friend){
                    var result = friend.name;
                    return {
                        title: result,
                        url: '/users/' + friend.id
                    };
                });
            }
            return undefined;
        },

        updateFollowingBtn : function(){
            var self = this;
            var visitedUser = self.model.get('id');
            var loggedUser = $.cookie(Common.CURRENT_USER_ID);

            $.ajax({
                url : Common.getSecuredUrl('users/' + loggedUser, false),
                type : 'GET',
                contentType: 'application/json'
            }).done(function(user){
                if(_.findWhere(user.following, {id: visitedUser})){
                    self.$('.followBtn i').removeClass('mdi-social-person-add').addClass('mdi-social-person-outline');
                    self.$('.followBtn').removeClass('green').addClass('red').addClass('unfollowBtn');
                    self.$('.followBtnText').text('Unfollow');
                }
                else{
                    self.$('.followBtn i').removeClass('mdi-social-person-outline').addClass('mdi-social-person-add');
                    self.$('.followBtn').removeClass('unfollowBtn').removeClass('red').addClass('green');
                    self.$('.followBtnText').text('Follow');
                }
            });
        }
    });
});
