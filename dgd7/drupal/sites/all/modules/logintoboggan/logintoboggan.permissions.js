// $Id: logintoboggan.permissions.js,v 1.3 2011/01/06 06:52:19 thehunmonkgroup Exp $

/**
 * This is a custom implementation of user.permissions.js, which is necessary
 * because LoginToboggan needs its pre-auth role to not be explicitly tied to
 * the auth role.  The change is minor -- simply exclude the pre-auth role from
 * all the auto-checking as the anon and auth user roles are.
 */

(function ($) {

/**
 * Shows checked and disabled checkboxes for inherited permissions.
 */
Drupal.behaviors.permissions = {
  attach: function (context) {
    $('table#permissions:not(.permissions-processed)').each(function () {
      // Create dummy checkboxes. We use dummy checkboxes instead of reusing
      // the existing checkboxes here because new checkboxes don't alter the
      // submitted form. If we'd automatically check existing checkboxes, the
      // permission table would be polluted with redundant entries. This
      // is deliberate, but desirable when we automatically check them.
      $(':checkbox', this).not('[name^="2["]').not('[name^="1["]').not('[name^="' + Drupal.settings.LoginToboggan.preAuthID + '["]').each(function () {
        $(this).addClass('real-checkbox');
        $('<input type="checkbox" class="dummy-checkbox" disabled="disabled" checked="checked" />')
          .attr('title', Drupal.t("This permission is inherited from the authenticated user role."))
          .insertAfter(this)
          .hide();
      });

      // Helper function toggles all dummy checkboxes based on the checkboxes'
      // state. If the "authenticated user" checkbox is checked, the checked
      // and disabled checkboxes are shown, the real checkboxes otherwise.
      var toggle = function () {
        $(this).closest('tr')
          .find('.real-checkbox')[this.checked ? 'hide' : 'show']().end()
          .find('.dummy-checkbox')[this.checked ? 'show' : 'hide']();
      };

      // Initialize the authenticated user checkbox.
      $(':checkbox[name^="2["]', this)
        .click(toggle)
        .each(function () { toggle.call(this); });
    }).addClass('permissions-processed');
  }
};

})(jQuery);

