import { applyDiffLocale } from "../src/i18n/diffMessages";
import { setTranslationLocale } from "../src/i18n/tr";

// Unit tests assert the source English labels. The product UI defaults to Chinese
// before settings load, so pin the unit-test locale back to English at module init.
setTranslationLocale("en");
applyDiffLocale("en");
