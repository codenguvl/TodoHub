import axios from "axios";
import { getBaseUrl, getHeaders } from "../helpers";
import {
  type GetWorkPeriodsResponse,
  type PostWorkPeriodResponse,
} from "@/app/api/workPeriods/route";
import {
  type PatchWorkPeriodBody,
  type PatchWorkPeriodResponse,
} from "@/app/api/workPeriods/[workPeriod_id]/route";

const baseUrl = getBaseUrl();

export const workPeriodsRoutes = {
  postWorkPeriod: async ({ projectId }: { projectId?: string }) => {
    try {
      const { data } = await axios.post<PostWorkPeriodResponse>(
        `${baseUrl}/api/workPeriods?projectId=${projectId}`,
        {
          headers: getHeaders(),
        }
      );
      return data.workPeriod;
    } catch (error) {
      console.error(error);
    }
  },
  getWorkPeriods: async ({ projectId }: { projectId?: string }) => {
    const { data } = await axios.get<GetWorkPeriodsResponse>(
      `${baseUrl}/api/workPeriods?projectId=${projectId}`,
      {
        headers: getHeaders(),
      }
    );
    return data.workPeriods;
  },
  patchWorkPeriod: async ({
    workPeriodId,
    ...body
  }: PatchWorkPeriodBody & { workPeriodId: string }) => {
    const { data } = await axios.patch<PatchWorkPeriodResponse>(
      `${baseUrl}/api/workPeriods/${workPeriodId}`,
      body,
      {
        headers: getHeaders(),
      }
    );

    return data.workPeriod;
  },
  deleteWorkPeriod: async ({ workPeriodId }: { workPeriodId: string }) => {
    const { data } = await axios.delete<PatchWorkPeriodResponse>(
      `${baseUrl}/api/workPeriods/${workPeriodId}`,
      {
        headers: getHeaders(),
      }
    );
    return data.workPeriod;
  },
};
