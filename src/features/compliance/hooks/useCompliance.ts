import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/shared/lib';

export const useCompliance = (userId: string) => {
  const queryClient = useQueryClient();

  const getLatestAssessment = async () => {
    const { data, error } = await supabase
      .from('risk_assessments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    return data;
  };

  const saveAssessment = async (assessmentData: any) => {
    const { data, error } = await supabase
      .from('risk_assessments')
      .insert([assessmentData])
      .select();

    if (error) throw error;
    return data;
  };

  const { data: latestAssessment, isLoading } = useQuery({
    queryKey: ['complianceAssessment', userId],
    queryFn: getLatestAssessment,
    enabled: !!userId,
  });

  const { mutate: saveAssessmentMutation } = useMutation({
    mutationFn: saveAssessment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complianceAssessment', userId] });
    },
  });

  return { latestAssessment, isLoading, saveAssessment: saveAssessmentMutation };
};
