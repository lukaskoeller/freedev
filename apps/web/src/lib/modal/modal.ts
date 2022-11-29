// Credits to Adam Argyle
// See https://github.com/argyleink/gui-challenges/blob/main/dialog/dialog.js

// custom events to be added to <dialog>
const dialogClosingEvent = new Event('closing')
const dialogClosedEvent  = new Event('closed')
const dialogOpeningEvent = new Event('opening')
const dialogOpenedEvent  = new Event('opened')
const dialogRemovedEvent = new Event('removed')

// track opening
export const dialogAttrObserver = new MutationObserver((mutations, observer) => {
  mutations.forEach(async mutation => {
    if (mutation.attributeName === 'open') {
      const dialog = mutation.target as HTMLDialogElement;

      const isOpen = dialog.hasAttribute('open');
      if (!isOpen) return

      dialog.removeAttribute('inert');

      // set focus
      const focusTarget = dialog.querySelector('[autofocus]') as HTMLDialogElement;
      focusTarget
        ? focusTarget.focus()
        : dialog.querySelector('button').focus();

      dialog.dispatchEvent(dialogOpeningEvent)
      await animationsComplete(dialog)
      dialog.dispatchEvent(dialogOpenedEvent)
    }
  });
});

// track deletion
export const dialogDeleteObserver = new MutationObserver((mutations, observer) => {
  mutations.forEach(mutation => {
    mutation.removedNodes.forEach(removedNode => {
      if (removedNode.nodeName === 'DIALOG') {
        removedNode.removeEventListener('click', lightDismiss)
        removedNode.removeEventListener('close', dialogClose)
        removedNode.dispatchEvent(dialogRemovedEvent)
      }
    });
  });
});

// wait for all dialog animations to complete their promises
const animationsComplete = (element: HTMLElement) =>
  Promise.allSettled(
    element.getAnimations().map(animation => 
      animation.finished));

// click outside the dialog handler
export const lightDismiss = ({ target: dialog }) => {
  if (dialog.nodeName === 'DIALOG')
    dialog.close('dismiss');
};

export const dialogClose = async ({ target: dialog }) => {
  dialog.setAttribute('inert', '');
  dialog.dispatchEvent(dialogClosingEvent);

  await animationsComplete(dialog);

  dialog.dispatchEvent(dialogClosedEvent);
};