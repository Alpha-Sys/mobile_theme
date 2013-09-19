[{if $oViewConf->isExpressCheckoutEnabledInDetails() && !$oDetailsProduct->isNotBuyable()}]
    [{oxstyle include=$oViewConf->getModuleUrl('oethemeswitcher','out/mobile/src/css/paypal_mobile.css')}]

    [{ $oViewConf->getHiddenSid() }]
    <div id="paypalExpressCheckoutDetailsBox" class="paypalExpressCheckoutBox paypalExpressCheckoutDetailsBox">
        <input type="hidden" name="oePayPalCancelURL" value="[{$oViewConf->getCurrentURL()}]"/>
        <input id="paypalExpressCheckoutDetailsButton" class="paypalCheckoutBtn" type="image" name="paypalExpressCheckoutButton" src="[{$oViewConf->getModuleUrl('oethemeswitcher','out/mobile/src/img/')}]checkout-paypal-medium-[{$oViewConf->getActLanguageAbbr()}].png" title="[{$oViewConf->getPayPalPaymentDescription()|strip_tags:false|trim|oxescape}]">
        <p class="paypalExpressCheckoutMsg">[{oxmultilang ident="OR"}]</p>
    </div>

    [{oxscript add='$("#paypalExpressCheckoutDetailsButton").click(function (){$("<input />").attr("type", "hidden").attr("name", "doPaypalExpressCheckoutFromDetailsPage").attr("value", "true").appendTo(".js-oxProductForm");return true;});'}]
    [{oxscript include=$oViewConf->getModuleUrl('oepaypal','out/src/js/oepaypalonclickproceedaction.js') priority=10 }]
    [{oxscript add='$( "#paypalExpressCheckoutDetailsButton" ).oePayPalOnClickProceedAction( {sAction: "actionExpressCheckoutFromDetailsPage", sFormContainer: "#productinfo" } );'}]
[{/if}]

[{$smarty.block.parent}]