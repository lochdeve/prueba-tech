import { TextListController } from './infrastructure/ui/controllers/TextListController.js';

function initializeApp() {
  const textListController = TextListController();
  textListController.initialize();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
