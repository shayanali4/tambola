import React, { Component } from 'react';
import $ from 'jquery';

class GoogleTranslate extends Component {


    googleTranslateElementInit() {
        if(window.google && window.google.translate && window.google.translate.TranslateElement)
        {
          new window.google.translate.TranslateElement({ includedLanguages: 'en,fr,es,de,ar,hi,gu,kn,pa,id,fil,sr',layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element');
        }
     }

    componentDidMount() {
        // alert("test")

        if(document.getElementById('googletranslatescript') == null)
        {
         const script = document.createElement('script');
          script.type = 'text/javascript';
          script.async = true;
          script.id = 'googletranslatescript';
          script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
          document.body.appendChild(script);
        }


        $('#google_translate_element').on("click", function () {

            // Change font family and color
            $("iframe").contents().find(".goog-te-menu2-item div, .goog-te-menu2-item:link div, .goog-te-menu2-item:visited div, .goog-te-menu2-item:active div").css({ 'color': '#544F4B'});
            $("iframe").contents().find(".goog-te-menu2-item div").hover(function(){
              $(this).css("background-color", "#544F4B");
              $(this).css('color' , "white");
              }, function(){
              $(this).css("background-color", "white");
              $(this).css('color' , "#544F4B");
            });
        });

        setTimeout(() => {
          this.googleTranslateElementInit();
        }, 5000);


    }

    render() {
        return (
            <div id="google_translate_element"></div>
          );
     }
}

export default GoogleTranslate;
