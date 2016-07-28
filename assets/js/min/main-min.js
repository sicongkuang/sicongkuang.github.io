jQuery(document).ready(function(e){e(".level-bar-inner").css("width","0"),e(window).on("load",function(){e(".level-bar-inner").each(function(){var n=e(this).data("level")
e(this).animate({width:n},800)})}),e(".level-label").tooltip(),GitHubCalendar("#github-graph","sicongkuang")})
