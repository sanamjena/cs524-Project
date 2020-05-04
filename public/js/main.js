$(document).ready(function () {
    $(".signup-action-btn").click(function (event) {
        formId = 'form-create-user';
        if (!validateFormFields(formId)) {
            event.preventDefault();
        }
    });
    $(".location-action-btn").click(function (event) {
        form = 'form-add-location';

        if (!validateFormFields(form)) {
            event.preventDefault();
        }
    });



    $(".login-action-btn").click(function (event) {
        formId = 'user-login-user';
        if (!validateFormFields(formId)) {
            event.preventDefault();
        }
    });

    $(".admin-delete-restaurant").click(function (event) {
        ele = $(this);
        swal({
                title: "Are you sure?",
                text: "Do you really wanna remove this restaruant?",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Remove",
                closeOnConfirm: false
            },
            function () {
                restaurantId = ele.attr('data-id');
                postData = {
                    'restaurantid': restaurantId
                }
                $.ajax({
                    type: 'POST',
                    url: '/restaurant/deleterestaurant',
                    data: postData,
                    success: function (response) {
                        location.reload();
                    },
                    error: function (error) {
                        console.log("Exception Caught: " + error);
                    }
                });
            });
        
    });

    $(".account-info-wrapper .update-profile").click(function(event){
        userEmail = $("#email").val().toLowerCase();
        if(!validateEmail(userEmail)) {
            swal({
                title: "Invalid Email",
                text: "Provide a valid email",
                type: "warning",
                showCancelButton: false,
                confirmButtonClass: 'btn-primary',
                confirmButtonText: 'OK'
            }); 
            return false;
        }
        postData = {
            'firstname' : $("#firstname").val().toLowerCase(),
            'lastname' : $("#lastname").val().toLowerCase(),
            'username' : $("#username").val().toLowerCase(),
            'email' : $("#email").val().toLowerCase()
        }
        $.ajax({
            type: 'POST',
            url: '/user/updateprofile',
            data: postData,
            success: function(response) {
                if(response.validation) {
                    $("#firstname").val(response.firstname);
                    $("#firstname").attr("disabled", true);
                    $("#lastname").val(response.lastname);
                    $("#lastname").attr("disabled", true);
                    $("#username").val(response.username);
                    $("#username").attr("disabled", true);
                    $("#email").val(response.email);
                    $("#email").attr("disabled", true);
                    swal("Done!", "Your profile is now updated!", "success");
                } else {
                    swal({
                        title: "Error",
                        text: response.message,
                        type: "warning",
                        showCancelButton: false,
                        confirmButtonClass: 'btn-primary',
                        confirmButtonText: 'OK'
                    }); 
                }
                
            },
            error: function(error) {
                console.log("Exception Caught: " + error);
            }
        });
    });

    $(".account-info-wrapper .edit-section").click(function(event){
        ele = $(this);
        formGroupDiv = ele.parent();
        console.log(formGroupDiv.attr('class'));
        formGroupDiv.find(':input').removeAttr('disabled');
        formGroupDiv.find(':input').focus();
        $(".btn-account-div").show();
    });

    $(".delete-item-wishlist").click(function(event){
        ele = $(this);
        parentElementDiv = ele.parent();
        var restaurantId = ele.attr('data-id');
        postData = {
            'restaurantid' : restaurantId
        }
        swal({
            title: "Are you sure?",
            text: "Do you really wanna remove from your wishlist?",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Remove",
            closeOnConfirm: false
        },
        function(){
            $.ajax({
                type: 'POST',
                url: '/user/removefromwishlist',
                data: postData,
                success: function(response) {
                    if(response.validation) {
                        swal("Removed!", "The restaurant is removed from your wishlist", "success");
                        location.reload();
                    } else {
                       swal({
                            title: "You are not logged in!",
                            text: "Please login to add to wishlist..",
                            type: "warning",
                            showCancelButton: false,
                            confirmButtonClass: 'btn-primary',
                            confirmButtonText: 'OK'
                        }); 
                    }
                },
                error: function(error) {
                    console.log("Exception Caught: " + error);
                }
            });
        });
    });

    $("button.comment-submit").click(function(event){
        commentText = $(".comment-div-wrapper textarea.comment-area").val();
        restaurantId = $(".retaurant_id").val();
        if (!commentText || commentText === "") {
            $(".comment-div-wrapper textarea.comment-area").addClass("validate-input");
            return false;
        }
        postData = {
            'commenttext': commentText,
            'restaurantid': restaurantId
        }
        $.ajax({
            type: 'POST',
            url: '/comment/addcomment',
            data: postData,
            success: function (response) {
                console.log(response);
                if (response.validation) {
                    $('.user-comments').append('<div class="comment-text">"' + response.commenttext + '"</div>');
                    $('.user-comments').append('<div class="username-text">- ' + response.username + '</div>');
                    $(".user-review-section").hide();
                    return false;
                } else {
                    swal({
                        title: "You are not logged in!!",
                        text: "Please login to comment..",
                        type: "warning",
                        showCancelButton: false,
                        confirmButtonClass: 'btn-primary',
                        confirmButtonText: 'OK'
                    });
                }
            },
            error: function (error) {
                console.log("Exception Caught: " + error);
            }
        });
    });

    $(".wishlist-add-wrapper .place-options").click(function (event) {
        el = $(this);
        option = $(this).attr('data-action');
        restaurantId = $(this).attr('data-id');
        postData = {
            'restaurantid': restaurantId
        }
        if (option == "wishlist") {
            if (el.hasClass('added-to-wishlist')) {
                swal({
                        title: "Are you sure?",
                        text: "Do you really wanna remove from your wishlist?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonClass: "btn-danger",
                        confirmButtonText: "Remove",
                        closeOnConfirm: false
                    },
                    function () {
                        $.ajax({
                            type: 'POST',
                            url: '/user/removefromwishlist',
                            data: postData,
                            success: function (response) {
                                console.log(response);
                                console.log(response.validation);
                                if (response.validation) {
                                    swal("Removed!", "The restaurant is removed from your wishlist", "success");
                                    el.removeClass("added-to-wishlist");
                                    console.log(response);
                                } else {
                                    swal({
                                        title: "You are not logged in!",
                                        text: "Please login to add to wishlist..",
                                        type: "warning",
                                        showCancelButton: false,
                                        confirmButtonClass: 'btn-primary',
                                        confirmButtonText: 'OK'
                                    });
                                }
                            },
                            error: function (error) {
                                console.log("Exception Caught: " + error);
                            }
                        });
                    });
            } else {
                $.ajax({
                    type: 'POST',
                    url: '/user/addtowishlist',
                    data: postData,
                    success: function (response) {
                        console.log(response);
                        console.log(response.validation);
                        if (response.validation) {
                            el.addClass("added-to-wishlist");
                        } else {
                            swal({
                                title: "You are not logged in!",
                                text: "Please login to add to wishlist..",
                                type: "warning",
                                showCancelButton: false,
                                confirmButtonClass: 'btn-primary',
                                confirmButtonText: 'OK'
                            });
                        }
                    },
                    error: function (error) {
                        console.log("Exception Caught: " + error);
                    }
                });
            }
        } else {
            if (el.hasClass('upvoted')) {
                postData.vote = false;
            } else {
                postData.vote = true;
            }
            console.log(postData);
            $.ajax({
                type: 'POST',
                url: '/restaurant/vote',
                data: postData,
                success: function (response) {
                    console.log(response);
                    console.log(response.validation);
                    if (response.validation) {
                        if (postData.vote) {
                            el.addClass("upvoted");
                        } else {
                            el.removeClass("upvoted");
                        }
                    } else {
                        swal({
                            title: "You are not logged in!",
                            text: "Please login to post your vote",
                            type: "warning",
                            showCancelButton: false,
                            confirmButtonClass: 'btn-primary',
                            confirmButtonText: 'OK'
                        });
                    }
                },
                error: function (error) {
                    console.log("Exception Caught: " + error);
                }
            });
        }
    });


});

function validateFormFields(formId) {
    validation = true;
    $("#" + formId + " input").each(function () {
        if (!$(this).val()) {
            validation = false;
            $(this).addClass("validate-input");
        }
    });
    return validation;
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}