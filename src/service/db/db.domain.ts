import {SelectQueryBuilder} from "typeorm";
import {PageInfo} from "../response";

export interface PageQuerySelectQueryBuilder<Entity> extends SelectQueryBuilder<Entity> {
    getPageData(pageInfo: PageInfo): Promise<{ data: Entity[], pageInfo: PageInfo }>;
}