<?php
/**
 * #PHPHEADER_OXID_LICENSE_INFORMATION#
 *
 * @link      http://www.oxid-esales.com
 * @package   core
 * @copyright (c) OXID eSales AG 2003-#OXID_VERSION_YEAR#
 * @version   SVN: $Id: $
 */

/**
 * Class handling shop themes
 *
 */
class oemobilethemetheme extends oemobilethemetheme_parent
{
    /**
     * Active theme type (mobile|desktop)
     * @var string
     */
    protected $_sActiveType = null;

    /**
     * Checks if loaded theme is active in shop
     * Now you can activate few themes, but with different types
     *
     * @return bool
     */
    public function isActive()
    {
        if ( $this->_blActive == null ) {
            $this->_blActive = false;
            $oConfig = $this->getConfig();
            $sId = $this->getId();
            //check if theme is active mobile theme
            if ( $sId == $oConfig->getConfigParam('sMobileTheme') ) {
                $this->_blActive = true;
            }
            //check if theme is active as desktop theme
            //only one desktop theme can be active (custom or main)
            if ( $sId == $oConfig->getConfigParam('sCustomTheme') || ($sId == $oConfig->getConfigParam('sTheme') && !$oConfig->getConfigParam('sCustomTheme')) ) {
                $this->_blActive = true;
            }
        }
        return $this->_blActive;
    }

    /**
     * Set theme as active
     *
     * @return null
     */
    public function activate()
    {
        $sError = $this->checkForActivationErrors();
        if ($sError) {
            throw oxNew( "oxException", $sError );
        }

        $blMobile = $this->getInfo('mobile');
        $blDesk   = $this->getInfo('desktop');
        if ( $blMobile ) {
            $this->getConfig()->saveShopConfVar("str", 'sMobileTheme', $this->getId());
        }
        if ( !$blMobile || $blDesk ) {
            $sParent = $this->getInfo('parentTheme');
            if ($sParent) {
                $this->getConfig()->saveShopConfVar("str", 'sTheme', $sParent);
                $this->getConfig()->saveShopConfVar("str", 'sCustomTheme', $this->getId());
            } else {
                $this->getConfig()->saveShopConfVar("str", 'sTheme', $this->getId());
                $this->getConfig()->saveShopConfVar("str", 'sCustomTheme', '');
            }
        }
    }

    /**
     * Deactivate only mobile theme
     *
     * @return null
     */
    public function deactivate()
    {
        $sError = $this->_checkForDeactivationErrors();
        if ($sError) {
            throw oxNew( "oxException", $sError );
        }
        $this->getConfig()->saveShopConfVar("str", 'sMobileTheme', "");
        $blDesk = $this->getInfo('desktop');
        $sMainTheme = $this->getConfig()->getConfigParam('sTheme');
        $sMobileTheme = $this->getConfig()->getConfigParam('sMobileTheme');
        if ( $blDesk && $sMainTheme == $sMobileTheme) {
            $this->getConfig()->saveShopConfVar("str", 'sTheme', "");
        }
    }

    /**
     * Set theme info
     *
     * @param string $sName  name of info item
     * @param string $sValue value of info item
     *
     * @return null
     */
    public function setInfo($sName, $sValue)
    {
        $this->_aTheme[$sName] = $sValue;
    }

    /**
     * return current active theme, or custom theme if specified
     *
     * @return string
     */
    public function getActiveThemeId()
    {
        $sType = $this->getActiveThemeType();
        if ( $sType == 'mobile' ) {
            return $this->getConfig()->getConfigParam('sMobileTheme');
        }
        $sCustTheme = $this->getConfig()->getConfigParam('sCustomTheme');
        if ($sCustTheme) {
            return $sCustTheme;
        }
        return $this->getConfig()->getConfigParam('sTheme');
    }

    /**
     * Return EXCEPTION_* translation string if error
     * found or false on success
     *
     * @return string
     */
    protected function _checkForDeactivationErrors()
    {
        $blMobile = $this->getInfo('mobile');
        if (!$blMobile) {
            return 'EXCEPTION_THEME_NOT_MOBILE';
        }

        $blDesk   = $this->getInfo('desktop');
        $sMainTheme = $this->getConfig()->getConfigParam('sTheme');
        $sMobileTheme = $this->getConfig()->getConfigParam('sMobileTheme');
        $sCustomTheme = $this->getConfig()->getConfigParam('sCustomTheme');
        if ( $blDesk && $sMobileTheme == $sMainTheme && !$sCustomTheme) {
            return 'EXCEPTION_THEME_LAST_ACTIVE';
        }
        return false;
    }

    /**
     * Checks if current device uses mobile or desktop type theme
     *
     * @return string theme type (mobile or desktop)
     */
    public function getActiveThemeType()
    {
        if ( $this->_sActiveType === null ) {
            $this->setActiveThemeType();
        }
        return $this->_sActiveType;
    }

    /**
     * Active theme setter
     *
     * @param string $sType theme type (mobile or desktop)
     */
    public function setActiveThemeType( $sType = '' )
    {
        if ( $sType ) {
            $this->_sActiveType = $sType;
            oxRegistry::get("oxUtilsServer")->setOxCookie('sThemeType', $sType);
        } else {
            $sCookieType = oxRegistry::get("oxUtilsServer")->getOxCookie('sThemeType');
            if ( $sCookieType ) {
                $this->_sActiveType = $sCookieType;
            } else {
                $this->_sActiveType = 'desktop';
                $sDeviceType = oxRegistry::get("oxUtilsServer")->getDeviceType();
                // if mobile device is detected and mobile theme is set
                if ( ($sDeviceType == 'mobile') && $this->getConfig()->getConfigParam('sMobileTheme') ) {
                    $this->_sActiveType = 'mobile';
                }
            }

        }
    }
}
