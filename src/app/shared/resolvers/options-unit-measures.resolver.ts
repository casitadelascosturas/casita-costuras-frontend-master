import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { ResponseApi } from '../interfaces/response-api';
import { RoleAll } from '../interfaces/role/role';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GridCrudService } from '../services/crud/grid-crud.service';
import { MEASURES } from '../constants/endpoints';
import { PossibleValueSelect } from '../interfaces/components/select';
import { UtilsService } from '../services/utils/utils.service';

export const optionsUnitMeasuresResolver: ResolveFn<Observable<PossibleValueSelect[]>> = (route, state) => {
  const utilsService = inject(UtilsService);
  
  return utilsService.loadOptions('options-unit-measures').pipe(
    map((response: PossibleValueSelect[]) => {
      return response as PossibleValueSelect[] || [];
    })
  );
};
