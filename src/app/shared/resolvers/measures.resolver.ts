import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { ResponseApi } from '../interfaces/response-api';
import { RoleAll } from '../interfaces/role/role';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GridCrudService } from '../services/crud/grid-crud.service';
import { MEASURES } from '../constants/endpoints';
import { PossibleValueSelect } from '../interfaces/components/select';


export const measuresResolver: ResolveFn<Observable<PossibleValueSelect[]>> = (route, state) => {
  const rolesService = inject(GridCrudService);

  return rolesService.getAllRoles(MEASURES).pipe(
    map(response => {
      return response?.data?.map(measure => ({
        label: measure.name,
        value: measure.id
      })) || [];
    })
  );
};