[{$smarty.block.parent}]

[{if $oViewConf->isExpressCheckoutEnabledInDetails() && !$oDetailsProduct->isNotBuyable()}]

    [{if $oView->showECSPopup()}]
        <div id="popupECS" class="popupBox corners FXgradGreyLight glowShadow">
            <img src="[{$oViewConf->getImageUrl('x.png')}]" alt="" class="closePop">
            <p>
                [{if $oView->getArticleAmount() gt 1}]
                    [{oxmultilang ident="OEPAYPAL_SAME_ITEMS_QUESTION" args=$oView->getArticleAmount()}]
                [{else}]
                    [{oxmultilang ident="OEPAYPAL_SAME_ITEM_QUESTION" args=$oView->getArticleAmount()}]
                [{/if}]
            </p>
            <div class="clear">
                <button id="actionAddToBasketAndGoToCheckout" type="submit" class="submitButton largeButton">
                    [{oxmultilang ident="OEPAYPAL_BUTTON_ADD_ITEM"}]
                </button>
                <button id="actionNotAddToBasketAndGoToCheckout" type="submit" class="submitButton largeButton">
                    [{oxmultilang ident="OEPAYPAL_BUTTON_DO_NOT_ADD_ITEM"}]
                </button>
                <div class="oePayPalPopupNav">
                    <a href="[{oxgetseourl ident=$oViewConf->getSelfLink()|cat:"cl=basket"}]" class="textButton largeButton">[{oxmultilang ident="OEPAYPAL_MINIBASKET_DISPLAY_BASKET"}]</a>
                    <button class="textButton largeButton closePop">[{oxmultilang ident="OEPAYPAL_CANCEL"}]</button>
                </div>
            </div>
        </div>

        [{oxscript include=$oViewConf->getModuleUrl('oepaypal','out/src/js/oepaypalonclickproceedaction.js') priority=10 }]
        [{*Change actions on button click*}]
        [{oxscript add='$( "#actionNotAddToBasketAndGoToCheckout" ).oePayPalOnClickProceedAction( {sAction: "actionNotAddToBasketAndGoToCheckout", sFormContainer: "#productinfo"} );'}]
        [{oxscript add='$( "#actionAddToBasketAndGoToCheckout" ).oePayPalOnClickProceedAction( {sAction: "actionAddToBasketAndGoToCheckout", sFormContainer: "#productinfo"} );'}]
        [{*Add same amount to #amountToBasket input*}]
        [{oxscript add='$( "#amountToBasket" ).val( '|cat:$oView->getArticleAmount()|cat:' );'}]
        [{*Add same label to #persistentParam input*}]
        [{if $oView->getPersistentParam()}]
            [{oxscript add='$( "#persistentParam" ).val( "'|cat:$oView->getPersistentParam()|cat:'" );'}]
        [{/if}]
        [{*Add same values to selection list*}]
        [{if $oView->getSelection()}]
            [{foreach from=$oView->getSelection() item=sSelection key=iKey}]
                [{oxscript add='
                    $( "#productSelections input[name=\'sel['|cat:$iKey|cat:']\']" ).val( "'|cat:$sSelection|cat:'" );
                    var sSelectionName'|cat:$iKey|cat:' = $( "#productSelections div:eq('|cat:$iKey|cat:') ul li a[data-seletion-id='|cat:$sSelection|cat:']" ).text();
                    $( "#productSelections div:eq('|cat:$iKey|cat:') p span" ).text( sSelectionName'|cat:$iKey|cat:' );
                '}]
            [{/foreach}]
        [{/if}]
        [{*Add same value to displayCartInPayPal checkbox*}]
        [{if $oView->displayCartInPayPal() eq 0}]
            [{oxscript add='$("input[name=displayCartInPayPal]").attr("checked", false);'}]
        [{/if}]
    [{/if}]

[{/if}]
