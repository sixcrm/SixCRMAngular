import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {GraphqlDocs2Service, HeadersInput} from '../../graphql-docs-2.service';
import {Type} from '../../models/type.model';
import {ActivatedRoute, ResolveEnd, Router} from "@angular/router";
import {AsyncSubject} from "rxjs";
import {Field} from "../../models/field.model";
import {SearchItem} from "../side-search/side-search.component";

@Component({
  selector: 'graphql-docs-2',
  templateUrl: './graphql-docs-2.component.html',
  styleUrls: ['./graphql-docs-2.component.scss']
})
export class GraphqlDocs2Component implements OnInit, OnDestroy {

  @Input() endpoint: string;
  @Input() headers: HeadersInput[];
  @Input() showSidenav: boolean;

  queryMutationTypes: Type[];
  queryMutationTypesFiltered: Type[];
  otherTypes: Type[];
  otherTypesFiltered: Type[];
  types: Type[];
  searchItems: SearchItem[];

  field: Field;
  type: Type;

  isQuery : boolean;
  isMutation: boolean;
  isType : boolean;
  isAll : boolean;
  loaded: boolean = false;
  filterString: string;

  protected unsubscribe$: AsyncSubject<boolean> = new AsyncSubject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private graphqlService: GraphqlDocs2Service,
    private router: Router) { }

  ngOnInit() {
    this.graphqlService.getFullWidth().subscribe(value => {
      this.showSidenav = !value;
    });

    this.graphqlService.getSchemaTypes(this.endpoint, this.headers).subscribe((response: {types: Type[], searchItems: SearchItem[]}) => {
      if (!response) return;

      this.types = response.types;
      this.searchItems = response.searchItems;
      this.loaded = true;

      this.graphqlService.navigateByAnchor();
      this.determineParameters(this.router.url);
      if (this.queryMutationTypes && this.otherTypes) {
        this.filterTroughAllTypes();
      }
    });

    this.router.events.takeUntil(this.unsubscribe$).subscribe((routeEvent) => {
      if (routeEvent instanceof ResolveEnd) {
        this.determineParameters(routeEvent.url);
      }
    });

    this.route.queryParams.subscribe(params => {
      this.filterString = params['filter'] || '';

      if (this.queryMutationTypes && this.otherTypes) {
        this.filterTroughAllTypes();
      }
    });

    this.determineParameters(this.router.url);
  }

  private determineParameters(url: string) {
    let baseUrl = '/documentation/graph2/';
    let query = url.replace(baseUrl + 'query/', '');
    let mutation = url.replace(baseUrl + 'mutation/', '');
    let type = url.replace(baseUrl + 'type/', '');

    this.isQuery = query !== url;
    this.isMutation = mutation !== url;
    this.isType = type !== url;
    this.isAll = !this.isQuery && !this.isMutation && !this.isType;

    let fieldName;
    if (this.types) {
      if (!this.isAll) {
        this.type = this.types.find(el => {
          let name;

          if (this.isQuery) {
            fieldName = query;
            name = 'Query';
          }

          if (this.isMutation) {
            fieldName = mutation;
            name = 'Mutation';
          }

          if (this.isType) {
            fieldName = type;
            return (!this.isQueryOrMutation(el.name) && (el.name === fieldName));
          }

          return el.name === name
        });

        if (this.isQueryOrMutation(this.type.name)) {
          this.field = this.type.fields.find(el => el.name === fieldName)
        }
      }

      if (this.isAll) {
        this.separateTypes();
      }
    }
  }

  separateTypes() {
    this.queryMutationTypes = this.types.filter(el => {
      return this.isQueryOrMutation(el.name)
    });

    this.otherTypes = this.types.filter(el => {
      return (!this.isQueryOrMutation(el.name));
    });

    this.queryMutationTypesFiltered = this.queryMutationTypes;
    this.otherTypesFiltered = this.otherTypes;
  }

  isQueryOrMutation(typeName: string) {
    return (typeName === 'Query') || (typeName === 'Mutation')
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  filterTroughAllTypes(): void {
    this.otherTypesFiltered = this.otherTypes;
    this.queryMutationTypesFiltered = JSON.parse(JSON.stringify(this.queryMutationTypes));

    if (this.filterString) {
      this.otherTypesFiltered = this.otherTypes.filter(el => {
        let name = el.name.toLowerCase();

        return name.includes(this.filterString.toLowerCase());
      });

      for (let i = 0; i < this.queryMutationTypes.length; i++) {
        this.queryMutationTypesFiltered[i].fields = this.queryMutationTypes[i].fields.filter(el => {
          let name = el.name.toLowerCase();

          return name.includes(this.filterString.toLowerCase());
        });
      }
    }
  }
}
