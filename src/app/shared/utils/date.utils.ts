import {TranslationService} from '../../translation/translation.service';

export function getMonths(translationService: TranslationService) {
  return [
    translationService.translate('DATEPICKER_JAN'),
    translationService.translate('DATEPICKER_FEB'),
    translationService.translate('DATEPICKER_MAR'),
    translationService.translate('DATEPICKER_APR'),
    translationService.translate('DATEPICKER_MAY'),
    translationService.translate('DATEPICKER_JUN'),
    translationService.translate('DATEPICKER_JUL'),
    translationService.translate('DATEPICKER_AUG'),
    translationService.translate('DATEPICKER_SEP'),
    translationService.translate('DATEPICKER_OCT'),
    translationService.translate('DATEPICKER_NOV'),
    translationService.translate('DATEPICKER_DEC')
  ]
}

export function getDays(translationService: TranslationService) {
  return [
    translationService.translate('DATEPICKER_SUN'),
    translationService.translate('DATEPICKER_MON'),
    translationService.translate('DATEPICKER_TUE'),
    translationService.translate('DATEPICKER_WED'),
    translationService.translate('DATEPICKER_THU'),
    translationService.translate('DATEPICKER_FRI'),
    translationService.translate('DATEPICKER_SAT')
  ]
}
