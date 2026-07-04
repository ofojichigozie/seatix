import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useParams } from 'react-router-dom';
import { useEventDetail, useEventActions } from '../../hooks/useEvents';
import { EVENT_CATEGORIES } from '../../types/event.types';
import Spinner from '../../components/common/Spinner';

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string().min(1),
  venue: z.string().min(3),
  eventDate: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const { event, loading: evtLoading } = useEventDetail(id!);
  const { updateEvent, loading } = useEventActions();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (event) {
      reset({
        title: event.title,
        description: event.description,
        category: event.category,
        venue: event.venue,
        eventDate: event.eventDate.slice(0, 16),
      });
    }
  }, [event, reset]);

  const onSubmit = async (data: FormData) => {
    await updateEvent(id!, data, '/organizer');
  };

  if (evtLoading)
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Event</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {(['title', 'venue'] as const).map((field) => (
          <div key={field}>
            <label className="mb-1 block text-sm font-medium capitalize text-gray-700">
              {field}
            </label>
            <input
              {...register(field)}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            {errors[field] && <p className="mt-1 text-xs text-red-500">{errors[field]?.message}</p>}
          </div>
        ))}

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
          <select
            {...register('category')}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            {EVENT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Date & Time</label>
          <input
            type="datetime-local"
            {...register('eventDate')}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          {errors.eventDate && (
            <p className="mt-1 text-xs text-red-500">{errors.eventDate.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60"
        >
          {loading && <Spinner size="sm" />}
          Save Changes
        </button>
      </form>
    </div>
  );
}
